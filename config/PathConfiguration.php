<?php

namespace config;

/**
 * PathConfiguration is an abstract class that provides constant attributes for file path configuration.
 */
abstract class PathConfiguration {
    /**
     * The path for storing orders.
     */
    public const ORDERS_PATH = 'storage/orders';

    /**
     * The path for storing temporary files.
     */
    public const TMP_PATH = 'storage/tmp';

    /**
     * The path for storing catalog.
     */
    public const CATALOG_PATH = 'storage/catalog';

    /**
     * The path for storing product images.
     */
    public const UPLOADS_PATH = 'public/images/uploads';

    /**
     * The path for storing pages.
     */
    public const TEMPLATES_PATH = 'public/templates';

    /**
     * The path for storing pages.
     */
    public const PAGES_PATH = 'public/pages';

    /**
     * The path for storing pages.
     */
    public const CSV_PATH = 'storage/csv';
}
