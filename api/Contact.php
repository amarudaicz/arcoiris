<?php

namespace api;

use Exception;
use JsonException;
use helpers\Response;
use config\PathConfiguration;
use config\EmailConfiguration;
use PHPMailer\PHPMailer\PHPMailer;

abstract class Contact {
    /**
     * @return void
     * @throws Exception
     * @throws JsonException
     */
    public static function createContactMessage(): void {
        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        if (!isset($request->name)) throw new Exception('Nombre requerido', 400);

        if (!isset($request->email)) throw new Exception('Email requerido', 400);

        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) throw new Exception('Email invalido', 400);

        if (!isset($request->phone)) throw new Exception('Teléfono requerido', 400);

        if (!isset($request->message)) throw new Exception('Mensaje requerido', 400);

        $mailer = new PHPMailer(true);

        $mailer->Host = EmailConfiguration::SMTP_HOST;
        $mailer->Port = EmailConfiguration::SMTP_PORT;
        $mailer->Username = EmailConfiguration::SMTP_USERNAME;
        $mailer->Password = EmailConfiguration::SMTP_PASSWORD;
        $mailer->SMTPAuth = true;
        $mailer->CharSet = PHPMailer::CHARSET_UTF8;
        $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mailer->isSMTP();
        $mailer->isHTML();

        $mailer->Subject = 'Mensaje de contacto desde arcoirisferretera.com';

        $mailer->setFrom(EmailConfiguration::SENDER_EMAIL, EmailConfiguration::SENDER_NAME);

        $mailer->addAddress(EmailConfiguration::CONTACT_RECEIVER_EMAIL, EmailConfiguration::CONTACT_RECEIVER_NAME);

        $mailer->addReplyTo($request->email, $request->name);

        $emailTemplate = file_get_contents(PathConfiguration::TEMPLATES_PATH . '/contact-email.html');

        $mailer->Body = str_replace([
            '<!--[Name]-->',
            '<!--[Email]-->',
            '<!--[Phone]-->',
            '<!--[Message]-->'
        ], [
            $request->name,
            $request->email,
            $request->phone,
            $request->message,
        ], $emailTemplate);

        if (!$mailer->send()) {
            throw new Exception('El email no se envió', 500);
        }

        Response::setCode(200);
    }
}