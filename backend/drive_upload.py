# drive_upload.py
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials

import os

# Authenticate with the service account
def authenticate_drive():
    scope = ['https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
    gauth = GoogleAuth()
    gauth.credentials = creds
    return GoogleDrive(gauth)

# Upload file to a specific folder
def upload_video_to_drive(file_path, folder_id):
    drive = authenticate_drive()
    file_name = os.path.basename(file_path)

    gfile = drive.CreateFile({'title': file_name, 'parents': [{'id': folder_id}]})
    gfile.SetContentFile(file_path)
    gfile.Upload()

    gfile.InsertPermission({
        'type': 'anyone',
        'value': 'anyone',
        'role': 'reader'
    })

    return f"https://drive.google.com/file/d/{gfile['id']}/view?usp=sharing"
