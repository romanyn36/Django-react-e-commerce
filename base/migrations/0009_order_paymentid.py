# Generated by Django 5.0.7 on 2024-08-03 03:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0008_order_itemsprice"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="paymentId",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
