<?php

namespace config;

/**
 * EmailConfiguration is an abstract class that provides constant attributes for email configuration.
 */
abstract class EmailConfiguration {
    /**
     * The SMTP host for the email server.
     */
    public const SMTP_HOST = 'smtp.hostinger.com';

    /**
     * The SMTP port for the email server.
     */
    public const SMTP_PORT = 465;

    /**
     * The username for SMTP authentication.
     */
    public const SMTP_USERNAME = 'noreply@arcoirisferretera.com.ar';

    /**
     * The password for SMTP authentication.
     */
    public const SMTP_PASSWORD = 'f02bp6OW0+h30bc20Qgyc9Qb';

    /**
     * The name of the sender.
     */
    public const SENDER_NAME = 'Arcoiris Ferretera';

    /**
     * The sender email address.
     */
    public const SENDER_EMAIL = 'noreply@arcoirisferretera.com.ar';

    /**
     * The name of the receiver.
     */
    public const CONTACT_RECEIVER_NAME = 'Arcoiris Ferretera';

    /**
     * The receiver email address.
     */
    public const CONTACT_RECEIVER_EMAIL = 'contacto@arcoirisferretera.com.ar';

    /**
     * The name of the receiver.
     */
    public const SALES_RECEIVER_NAME = 'Arcoiris Ferretera';

    /**
     * The receiver email address.
     */
    public const SALES_RECEIVER_EMAIL = 'ventas@arcoirisferretera.com.ar';
}
