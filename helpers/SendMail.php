<?php

namespace helpers;

/**
 *
 */
abstract class SendMail {
    /**
     * @param string $subject
     * @param string $file
     *
     * @return bool
     */
    public static function sendOrder(string $subject, string $file): bool {
        $boundary = sprintf("----------%s", md5(time()));

        $headers = [
            'MIME-Version' => '1.0',
            'From' => FROM_EMAIL,
            'Content-Type' => sprintf('multipart/mixed; boundary="%s"', $boundary)
        ];

        $message = sprintf("--%s\n", $boundary);
        $message .= "Content-Type: text/html; charset=UTF-8\n\n";
        $message .= sprintf("%s\n\n", file_get_contents('public/pages/emails/order.html'));
        $message .= sprintf("--%s\n", $boundary);
        $message .= "Content-Type: text/plain; charset=UTF-8\n";
        $message .= sprintf("Content-Description: %s\n", basename($file));
        $message .= sprintf("Content-Disposition: attachment; filename=\"%s\"\n", basename($file));
        $message .= sprintf("Content-Length: %d\n\n", filesize($file));
        $message .= file_get_contents($file);

        return mail(TO_EMAIL, $subject, $message, $headers);
    }

    /**
     * @param string $name
     * @param string $email
     * @param string $phone
     * @param string $message
     *
     * @return bool
     */
    public static function sendContactMessage(string $name, string $email, string $phone, string $message): bool {
        $headers = [
            'MIME-Version' => '1.0',
            'From' => FROM_EMAIL,
            'Content-Type' => 'text/html; charset=UTF-8'
        ];

        $html = file_get_contents('public/pages/emails/contact.html');

        $html = sprintf($html, $name, $email, $phone, $message);

        return mail(TO_EMAIL, 'Mensaje de contacto desde la web', $html, $headers);
    }
}