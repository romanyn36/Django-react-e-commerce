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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    we are customizing the token response to add more key value pairs to the response
    this using the simple jwt library
    """
    def validate(self, attrs):
        """
        this methgod overwrites the validate method of the parent class
        parent clase returns the access token and refresh token
        but we are adding more key value pairs to the response
        """
        data = super().validate(attrs)
        # make empty dictionary
        # data = {} # if we want remove the access and refresh token from the response and add our own

        refresh = self.get_token(self.user)
        
        # method 1 you can add the key value pairs manually
        # data["refresh"] = str(refresh)
        # data["access"] = str(refresh.access_token)
        # data["username"]=self.user.username
        # data["email"]=self.user.email

        # mthod 2 use serilizers that already have token and key value pairs
        serializer=UserSerializerWithToken(self.user).data
        data.update(serializer)
         
        return data
    
# login view
class MyTokenObtainPairView(TokenObtainPairView):
    """ now we are using the custom token response in the view to show the custom response
    this is api view for the token response //login
    note: this class requires POST request with username and password in the body by default
    """
    serializer_class = MyTokenObtainPairSerializer
    

@api_view(['POST']) 
def registerUser(request):
    print (request.data)
    data=request.data
    try:
        user=User.objects.create(
            first_name=data['name'],
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
    except:
        if User.objects.filter(username=data['username']).exists() and User.objects.filter(email=data['email']).exists():
            message={'detail':'User with this email and username already exists'}
        elif User.objects.filter(email=data['email']).exists():
            message={'detail':'User with this email already exists'}
        else:
            message={'detail':'User with this username already exists'}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)
    user.save()
    serlized=UserSerializerWithToken(user,many=False)
    return Response(serlized.data)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def getUserProfile(request):
    """
    get user profile must be authenticated using jwt token because we @api_view(['GET']) decorator
    that must recieve jwt token in the header
    theen the user is will be extracted from the token and returned
    note : we used the built in user model and is connected MyTokenObtainPairSerializer
    so any token generated by the MyTokenObtainPairSerializer will be able to extract the user
    # also we make default authentication class to be JWTAuthentication in the settings.py
    # permision classes is based on data from token
    """
    user=request.user
    serialized_users=UserSerializer(user,many=False)
    return Response(serialized_users.data)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    """
    update user profile must be authenticated using jwt token because we @api_view(['PUT']) decorator
    """
    user=request.user
    data=request.data
    print (data)
    user.first_name=data['name']
    user.username=data['username']
    user.email=data['email']
    if data['password'] != '':
        user.password=make_password(data['password'])
    user.save()
    serialized_users=UserSerializerWithToken(user,many=False)
    return Response(serialized_users.data,status=status.HTTP_200_OK)


# admin views to handle users
@api_view(['GET']) 
@permission_classes([IsAuthenticated,IsAdminUser]) 
def getUsers(request):
    users=User.objects.all()
    users=UserSerializer(users,many=True)
    return Response(users.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated,IsAdminUser])
def deleteUser(request,pk):
    user=User.objects.filter(id=pk)
    if user.exists():
        user=user.first()
        if user == request.user:
             return Response({'detail':'You cannot delete yourself'},status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'detail':'User deleted'},status=status.HTTP_200_OK)

    return Response({'detail':'User does not exist'},status=status.HTTP_400_BAD_REQUEST)
     

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
def getUserById(request,pk):
    user=User.objects.filter(id=pk)
    if user.exists():
        user=UserSerializer(user.first(),many=False)
        return Response(user.data,status=status.HTTP_200_OK)
    return Response({'detail':'User does not exist'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
# @permission_classes([IsAuthenticated,IsAdminUser])
def updateUser(request,pk):
    """
    update user data must be authenticated using jwt token because we @api_view(['PUT']) decorator
    """
    user=User.objects.filter(id=pk)
    if not user.exists():
        return Response({'detail':'User does not exist'},status=status.HTTP_400_BAD_REQUEST)
    user=user.first()
   
    data=request.data
    print(data)
    user.first_name=data['name']
    user.username=data['username']
    user.email=data['email']
    if data['isAdmin'] not in [None,'']:
        # print (data['isAdmin'])
        user.is_staff= data['isAdmin']
    user.save()
    serialized_users=UserSerializer(user,many=False)
    return Response(serialized_users.data,status=status.HTTP_200_OK)

    


    
