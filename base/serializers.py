from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order,OrderItem,Product,Review,ShippingAddress
from rest_framework_simplejwt.tokens import RefreshToken


class ProductSerializer(serializers.ModelSerializer):
    # ensure return product objects in json format
    reviews=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Product
        fields="__all__"
    def get_reviews(self,obj):
        reviews=obj.review_set.all()
        serlizer=ReviewSerializer(reviews,many=True)
        return serlizer.data
        
class ReviewSerializer(serializers.ModelSerializer):
    # ensure return review objects in json format
    class Meta:
        model=Review
        fields="__all__"
class ShippingAddressSerializer(serializers.ModelSerializer):
    # ensure return shipping address objects in json format
    class Meta:
        model=ShippingAddress
        fields="__all__"
class OrderItemSerializer(serializers.ModelSerializer):
    # ensure return order item objects in json format
    class Meta:
        model=OrderItem
        fields="__all__"
class OrderSerializer(serializers.ModelSerializer):
    # ensure return order objects in json format
    # now we return itesm in the order
    orderItems=serializers.SerializerMethodField(read_only=True)
    shippingAddress=serializers.SerializerMethodField(read_only=True)
    user=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Order
        fields="__all__"
    def get_orderItems(self,obj):
        """orderitem_set is default name for related name in Order model
        thats means if you have ordeitems objects related to order object you can get it by order.orderitem_set.all()
        """
        items=obj.orderitem_set.all() # get all related order items # just meed orderitems only
        # items=OrderItem.objects.filter(order=obj)# like a above line but more complex filter and less performance
        # items= OrderItem.objects.select_related('order').all() # get all order items related to order and order object in single query # make it efficient if you need order object
        items=obj.orderitem_set.select_related('order').all() #like otion 1 but more efficient if you need order object
        serlizer=OrderItemSerializer(items,many=True)
        return serlizer.data
    
    def get_user(self,obj):
        user=obj.user
        serlizer=UserSerializer(user,many=False)
        return serlizer.data
    def get_shippingAddress(self,obj):
        try:
            # get the first shipping address related to the order
            address=obj.shippingaddress
            address=ShippingAddressSerializer(address,many=False).data
        except:
            address=False
        return address
        
class UserSerializer(serializers.ModelSerializer):
    """each key have defualt getter if we need customize it key value we must customize or overwrrite getter
    or just keep original model key"""
    # ensure return product objects in json format
    class Meta:
        model=User
        fields=["id",'name',"username","email","isAdmin"]
    
        
    # assume we have empty fields in the model like name
    # we aoverwrite the getter
    name=serializers.SerializerMethodField(read_only=True)
    def get_name(self,obj):
        name=name=obj.first_name
        if name=='':
            name=obj.email
        return name
    isAdmin=serializers.SerializerMethodField(read_only=True)
    # isAdmin getter
    def get_isAdmin(self,obj):
        isAdmin=obj.is_staff
        return isAdmin
class UserSerializerWithToken(UserSerializer):
    """we just add new key "token"
    this inherited from UserSerializer so all keys in UserSerializer will be in UserSerializerWithToken
    """
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=["id",'name',"username","email","isAdmin",'token']
    def get_token(self,obj):
        """we genertae token for the user"""
        token=RefreshToken.for_user(obj)
        return str(token.access_token)
        