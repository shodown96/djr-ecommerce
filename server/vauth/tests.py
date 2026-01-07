import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

test_user = {
    "first_name": "New",
    "last_name": "User",
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
}


# Fixtures
@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        **test_user,
        is_active=True,
    )


@pytest.mark.django_db
def test_user_signup(api_client):
    payload = test_user

    response = api_client.post("/api/v1/auth/sign-up/", payload, format="json")

    assert response.status_code == 201
    assert User.objects.filter(email=test_user["email"]).exists()


@pytest.mark.django_db
def test_user_signin(api_client, user):
    payload = {
        "username": test_user["username"],
        "password": test_user["password"],
    }

    response = api_client.post("/api/v1/auth/sign-in/", payload, format="json")

    assert response.status_code == 200
    assert "access" in response.data['data']
    assert "refresh" in response.data['data']


@pytest.mark.django_db
def test_users_me(api_client, user):
    # Login first
    login_response = api_client.post(
        "/api/v1/auth/sign-in/",
        {
            "username": test_user["username"],
            "password": test_user["password"],
        },
        format="json",
    )

    access_token = login_response.data['data']["access"]

    # Attach JWT
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    response = api_client.get("/api/v1/auth/users/me/")

    assert response.status_code == 200
    assert response.data['data']["email"] == test_user["email"]


@pytest.mark.django_db
def test_users_me_unauthenticated(api_client):
    response = api_client.get("/api/v1/auth/users/me/")

    assert response.status_code == 401 or response.status_code == 404

@pytest.mark.django_db
def test_refresh_token(api_client, user):
    # First, sign in to get tokens
    login_response = api_client.post(
        "/api/v1/auth/sign-in/",
        {
            "username": test_user["username"],
            "password": test_user["password"],
        },
        format="json",
    )

    assert login_response.status_code == 200

    refresh_token = login_response.data['data']["refresh"]

    # Use refresh token to get new access token
    refresh_response = api_client.post(
        "/api/v1/auth/refresh-token/",
        {
            "refresh": refresh_token,
        },
        format="json",
    )

    assert refresh_response.status_code == 200
    assert "access" in refresh_response.data['data']
