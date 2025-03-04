from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from ..models import Product,Review,Order,OrderItem,ShippingAddress
# rest_framework
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.response import Response
from ..serializers import ProductSerializer,UserSerializer,UserSerializerWithToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Create your views here.
# customize simple jwt token response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger



# we allow get only request
@api_view(['GET']) 
def getProducts(request):
    # search by keyword
    keyword=request.query_params.get('keyword')
    # print(query)
    if keyword==None:
        keyword=''
    products=Product.objects.filter(name__icontains=keyword).order_by('id')
    # pagination
    page=request.query_params.get('page') # get page number
    numberPerpage=9
    paginator=Paginator(products,numberPerpage) # 3 products per page
    try:
        products=paginator.page(page)
    except PageNotAnInteger:
        # the page is not an integer deliver the first page
        products=paginator.page(1)
    except EmptyPage:
        # the page is out of range deliver the last page
        products=paginator.page(paginator.num_pages)
        
    if page==None:
        page=1
    page=int(page)
    
    
        
    serialized_products=ProductSerializer(products,many=True)
    return Response({'products':serialized_products.data,'page':page,'pages':paginator.num_pages},status=status.HTTP_200_OK)

@api_view(['GET']) 
def getProduct(request,pk):
    """
    get single product
    """
    product=Product.objects.filter(pk=pk)
    if not product.exists():
        return Response({'detail':'Product does not exist'},status=status.HTTP_400_BAD_REQUEST)
    product=product.first()
    serialized_product=ProductSerializer(product,many=False)
    return Response(serialized_product.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    """
    create product
    """
    user=request.user
      # data=request.data # this if you using content-type:application/json
    data=request.POST # this if you using content-type:multipart/form-data
    product=Product(
        user=user,
        name=data['name'],
        price=data['price'],
        brand=data['brand'],
        countInStock=data['countInStock'],
        category=data['category'],
        description=data['description'],
    )
    if request.FILES:
        image=request.FILES.get('image')
        product.image=image
    product.save()
    serialized_product=ProductSerializer(product,many=False)
    return Response(serialized_product.data,status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    """
    update product
    """
    # data=request.data # this if you using content-type:application/json
    data=request.POST # this if you using content-type:multipart/form-data
    product=Product.objects.filter(pk=pk)
    if not product.exists():
        return Response({'detail':'Product does not exist'},status=status.HTTP_400_BAD_REQUEST)
    product=product.first()
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=data['countInStock']
    product.category=data['category']
    image=request.FILES.get('image')
    if image:
        print('image')
        product.image=image
    product.description=data['description']
    
    product.save()
    serialized_product=ProductSerializer(product,many=False)
    return Response(serialized_product.data,status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    """
    delete product
    """
    product=Product.objects.filter(pk=pk)
    if  not product.exists() :
        return Response({'detail':'Product does not exist'},status=status.HTTP_400_BAD_REQUEST)
    product=product.first()
    product.delete()
    
    return Response({'detail':'Product deleted'},status=status.HTTP_200_OK)


@api_view(['POST'])
def createProductReview(request,pk):
    """
    create review
    """
    user=request.user
    data=request.data
    product=Product.objects.filter(pk=pk)
    if not product.exists():
        return Response({'detail':'Product does not exist'},status=status.HTTP_400_BAD_REQUEST)
    product=product.first()
    
    alreadyExists=product.review_set.filter(user=user).exists()
    if alreadyExists:
        return Response({'detail':'Product already reviewed'},status=status.HTTP_400_BAD_REQUEST)
    
    elif float(data['rating'])==0:
        return Response({'detail':'Please select a rating'},status=status.HTTP_400_BAD_REQUEST)
    else:
        review=Review(
            product=product,
            user=user,
            name=user.name,
            rating=float(data['rating']),
            comment=data['comment']
        )
        review.save()
        # update product rating
        #num of reviews
        reviews=product.review_set.all()
        product.numReviews=len(reviews)
        # total rating
        total=0
        for review in reviews:
            total+=review.rating
        product.rating=total/product.numReviews
        product.save()
        
        return Response({'detail':'Review added'},status=status.HTTP_201_CREATED)
    
@api_view(['GET'])

def getTopProducts(request):
    """
    get top products
    """
    products=Product.objects.filter(rating__gte=4).order_by('-rating')[:3]
    serialized_products=ProductSerializer(products,many=True)
    return Response(serialized_products.data,status=status.HTTP_200_OK)