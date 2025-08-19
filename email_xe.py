import smtplib
from email.message import EmailMessage

# 파일 경로 지정
cred_path = r"C:\Users\swkim518\inavi-calendar\credentials.txt"

# 파일에서 아이디, 비밀번호 읽기
with open(cred_path, "r") as f:
    email_id = f.readline().strip()
    email_pw = f.readline().strip()

msg = EmailMessage()
msg['Subject'] = '테스트 메일'
msg['From'] = email_id
msg['To'] = email_id
msg.set_content('안녕하세요, 테스트 메일입니다.')

with smtplib.SMTP('smtp-mail.outlook.com', 587) as smtp:
    smtp.ehlo()
    smtp.starttls()
    smtp.login(email_id, email_pw)
    smtp.send_message(msg)