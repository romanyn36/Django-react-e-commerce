from django.db import models
from django.contrib.auth.models import User
import os
from django.conf import settings
import shutil
def get_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    # check inistane type
    if isinstance(instance, Product):
         # in case of product table 
        return f'products/{filename}'
    # elif isinstance(instance, Admin):
    #     # in case of admin table
    #     return f'staff_{instance.pk}/{filename}'
    # elif isinstance(instance, DataHistory):
    #     # in data history table
    #     # cjeck the media type that is not null or empty
    #     if instance.image:
    #         media_type = 'image'
    #     elif instance.audio:
    #         media_type = 'audio'
    #     return f'user_{instance.user.pk}/{media_type}/{filename}'
# Create your models here.
class Product(models.Model):
    id=models.AutoField(primary_key=True,editable=False)
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,null=True,blank=True)
    image=models.ImageField(upload_to=get_directory_path,null=True,blank=True,default="placeholder.png")
    brand=models.CharField(max_length=200,null=True,blank=True)
    category=models.CharField(max_length=200,null=True,blank=True)
    description=models.TextField(null=True,blank=True)
    rating=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    numReviews=models.IntegerField(null=True,blank=True,default=0)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    countInStock=models.IntegerField(null=True,blank=True,default=0)
    createdAt=models.DateTimeField(auto_now_add=True)
    
    # in case of using s3 bucket
    def delete(self, *args, **kwargs):
        if self.image and self.image.name != 'placeholder.png':
            # delete the image file if it exists
            self.image.delete(save=False)
             
        super().delete(*args, **kwargs)
    def save(self, *args, **kwargs):
        # Check if a new image was uploaded
        if self.pk:
            try:
                old_product = Product.objects.get(pk=self.pk)
                if old_product.image != self.image:
                    if old_product.image.name != 'placeholder.png':
                        # Delete the old image file if it exists
                        old_product.image.delete(save=False)
            except Product.DoesNotExist:
                pass
        super().save(*args, **kwargs)
        
    
    

    def __str__(self):
        return self.name

class Review(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    name=models.CharField(max_length=200,null=True,blank=True)
    rating=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    comment=models.TextField(null=True,blank=True)
    createdAt=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    
class Order(models.Model):
    # set null when user is deleted
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    paymentMethod=models.CharField(max_length=200,null=True,blank=True)
    paymentId=models.CharField(max_length=200,null=True,blank=True)
    taxPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    shippingPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    itemsPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    totalPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    isPaid=models.BooleanField(default=False)
    paidAt=models.DateTimeField(auto_now_add=False,null=True,blank=True)
    isDelivered=models.BooleanField(default=False)
    deliveredAt=models.DateTimeField(auto_now_add=False,null=True,blank=True)
    createdAt=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.createdAt)
    
class OrderItem(models.Model):
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True) #foriegn means many to one relationship
    order=models.ForeignKey(Order,on_delete=models.CASCADE) # if order is deleted, delete the order item
    name=models.CharField(max_length=200,null=True,blank=True)
    quantity=models.IntegerField(null=True,blank=True,default=0)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    image=models.CharField(max_length=200,null=True,blank=True)
    
    def __str__(self):
        return self.name
    
class ShippingAddress(models.Model):
    # one to one relationship to make sure that each order has only one shipping address
    # for example, if user has multiple orders, each order has its own shipping address
    order=models.OneToOneField(Order,on_delete=models.CASCADE)
    address=models.CharField(max_length=200,null=True,blank=True)
    city=models.CharField(max_length=200,null=True,blank=True)
    postalCode=models.CharField(max_length=200,null=True,blank=True)
    country=models.CharField(max_length=200,null=True,blank=True)
    shippingPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    
    def __str__(self):
        return self.address
