from django.db.models.signals import pre_save
from django.contrib.auth.models import User
def updateUser(sender,instance,**kwargs):
    """
    this function will be triggered when the user model is updated
    
    """
    
    # print("updateUser signal triggerd")
    # this will update the username to be the email
    if instance.email != '':
        instance.username=instance.email
    pass
    

#  connect the signal to the user model
# shoiuld be in the ready method in the apps.py
pre_save.connect(updateUser,sender=User)