"""อัปโหลดโฟลเดอร์ site/ ขึ้นเซิร์ฟเวอร์ผ่าน SFTP (ตรวจลายนิ้วมือโฮสต์ก่อนส่งรหัสผ่าน)
ตัวแปรสภาพแวดล้อม: SFTP_HOST, SFTP_PORT, SFTP_USERNAME, SFTP_PASSWORD, SFTP_REMOTE_DIR, SFTP_HOST_KEY_SHA256
"""
import base64, hashlib, os, sys
import paramiko

host = os.environ["SFTP_HOST"]
port = int(os.environ.get("SFTP_PORT", "22"))
user = os.environ["SFTP_USERNAME"]
password = os.environ["SFTP_PASSWORD"]
remote = os.environ.get("SFTP_REMOTE_DIR", "htdocs").rstrip("/")
allowed = {x.strip() for x in os.environ["SFTP_HOST_KEY_SHA256"].split(",") if x.strip()}
local = sys.argv[1]

sock = paramiko.Transport((host, port))
sock.start_client()
key = sock.get_remote_server_key()
fp = "SHA256:" + base64.b64encode(hashlib.sha256(key.asbytes()).digest()).decode().rstrip("=")
if fp not in allowed:
    sys.exit(f"ลายนิ้วมือโฮสต์ไม่ตรงกับที่อนุญาต: {fp}")
sock.auth_password(user, password)
sftp = paramiko.SFTPClient.from_transport(sock)


def mkdir_p(path):
    try:
        sftp.stat(path)
    except IOError:
        sftp.mkdir(path)


mkdir_p(remote)
count = 0
for folder, _, files in os.walk(local):
    rel = os.path.relpath(folder, local)
    rdir = remote if rel == "." else f"{remote}/{rel.replace(os.sep, '/')}"
    mkdir_p(rdir)
    for name in files:
        sftp.put(os.path.join(folder, name), f"{rdir}/{name}")
        count += 1
print(f"อัปโหลด {count} ไฟล์ไปที่ {remote}/")
sftp.close()
sock.close()
