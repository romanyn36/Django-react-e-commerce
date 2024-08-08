from django.urls import path
from ..views import users_views,orders_views,products_views



urlpatterns=[
    path('',products_views.getProducts,name="products"),
    path('create/',products_views.createProduct,name="product-create"),
    path('<str:pk>/review/',products_views.createProductReview,name="create-review"),
    path('<str:pk>/',products_views.getProduct,name="product"),  # general links are at the bottom
    path('update/<str:pk>/',products_views.updateProduct,name="product-update"),
    path('delete/<str:pk>/',products_views.deleteProduct,name="product-delete"), 
]