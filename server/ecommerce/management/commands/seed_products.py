# products/management/commands/seed_products.py

import random
import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from ecommerce.models import Item, Variation, ItemVariation


IMAGE_URL = "https://picsum.photos/800/800"

PRODUCT_SEEDS = [
    "Classic White Shirt",
    "Casual Denim Shirt",
    "Sporty Jogger Set",
    "Athletic Training Tee",
    "Lightweight Jacket",
    "Winter Hoodie",
    "Urban Street Shirt",
    "Performance Sports Top",
    "Rainproof Windbreaker",
    "Minimal Cotton Shirt",
]

SIZES = ["S", "M", "L"]


class Command(BaseCommand):
    help = "Seed products with placeholder images"

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding products...")

        for title in PRODUCT_SEEDS:
            slug = slugify(title)

            if Item.objects.filter(slug=slug).exists():
                self.stdout.write(f"⚠️ Skipping {title}")
                continue

            response = requests.get(IMAGE_URL, timeout=10)

            if response.status_code != 200:
                self.stdout.write(f"❌ Image fetch failed for {title}")
                continue

            item = Item(
                title=title,
                slug=slug,
                price=random.randint(5000, 30000),
                discount_price=random.choice([None, random.randint(3000, 15000)]),
                category=random.choice(["S", "SW", "OW"]),
                label=random.choice(["P", "S", "D"]),
                description=f"{title} made with premium materials.",
            )

            item.image.save(
                f"{slug}.jpg",
                ContentFile(response.content),
                save=False,
            )

            item.save()
            self.stdout.write(f"✅ Created {item.title}")

            variation = Variation.objects.create(
                item=item,
                name="Size",
            )

            for size in SIZES:
                ItemVariation.objects.create(
                    variation=variation,
                    value=size,
                )

        self.stdout.write(self.style.SUCCESS("🎉 Done"))
