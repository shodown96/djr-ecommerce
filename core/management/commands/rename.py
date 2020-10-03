import os
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Renames a Django project'

    def add_arguments(self, parser):
        parser.add_argument('new_project_name', type=str,
                            help='The new Django project name')

    def handle(self, *args, **kwargs):
        new_project_name = kwargs['new_project_name']

        # logic for renaming the files

        files_to_rename = [
            'home/settings/base.py',
            'home/settings/dev.py',
            'home/settings/prod.py',
            'home/wsgi/dev.py',
            'home/wsgi/prod.py',
            'manage.py'
        ]
        folder_to_rename = 'home'

        for f in files_to_rename:
            with open(f, 'r') as file:
                filedata = file.read()

            filedata = filedata.replace('home', new_project_name)

            with open(f, 'w') as file:
                file.write(filedata)

        os.rename(folder_to_rename, new_project_name)

        self.stdout.write(self.style.SUCCESS(
            'Project has been renamed to %s' % new_project_name))
