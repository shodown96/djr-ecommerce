from mailjet_rest import Client
from django.conf import settings
from django.template.loader import render_to_string

mailjet = Client(
    auth=(settings.MAILJET_API_KEY, settings.MAILJET_SECRET_KEY),
    version="v3.1",
)

def send_email(
    to_email: str,
    subject: str,
    template_name: str,
    context: dict,
):
    """
    Sends a transactional email using a Django HTML template.
    """
    # Render HTML from Django templates
    html_content = render_to_string(template_name, context)

    data = {
        "Messages": [
            {
                "From": {
                    "Email": settings.MAIL_FROM_EMAIL,
                    "Name": settings.MAIL_FROM_NAME,
                },
                "To": [{"Email": to_email}],
                "Subject": subject,
                "HTMLPart": html_content,
            }
        ]
    }

    result = mailjet.send.create(data=data)

    if result.status_code >= 400:
        raise Exception(f"Mailjet error: {result.json()}")
