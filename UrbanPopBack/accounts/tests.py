from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from .serializers import SignupSerializer

User = get_user_model()


class SignupSerializerTests(TestCase):
    def test_signup_creates_user_with_hashed_password(self):
        serializer = SignupSerializer(
            data={
                "name": "Test Customer",
                "email": "customer@example.com",
                "password": "TestPassword123",
                "confirm_password": "TestPassword123",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        self.assertEqual(user.email, "customer@example.com")
        self.assertEqual(user.first_name, "Test Customer")
        self.assertTrue(user.check_password("TestPassword123"))
        self.assertNotEqual(user.password, "TestPassword123")

    def test_signup_rejects_passwords_that_do_not_match(self):
        serializer = SignupSerializer(
            data={
                "name": "Test Customer",
                "email": "customer@example.com",
                "password": "TestPassword123",
                "confirm_password": "DifferentPassword123",
            }
        )

        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

        self.assertEqual(User.objects.count(), 0)

    def test_signup_rejects_duplicate_email(self):
        User.objects.create_user(
            username="customer@example.com",
            email="customer@example.com",
            password="ExistingPassword123",
        )

        serializer = SignupSerializer(
            data={
                "name": "Another Customer",
                "email": "CUSTOMER@example.com",
                "password": "TestPassword123",
                "confirm_password": "TestPassword123",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
