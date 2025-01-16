<?php

namespace controllers;

use Exception;
use models\Product;
use config\PathConfiguration;
use helpers\Logger;
use models\Session;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Writer\Xls;

/**
 *
 */
abstract class Home
{
    /**
     * @return void
     */
    public static function home(): void
    {
        echo file_get_contents('public/pages/home/home.html');
    }

    /**
     * @return void
     */
    public static function products(): void
    {
        echo file_get_contents('public/pages/products/products.html');
    }

    /**
     * @throws Exception
     */
    public static function downloadPDFProductFile(): void
    {
        $signedIn = true;

        if (!isset($_SESSION['customer']) && !isset($_SESSION['user'])) {
            $signedIn = false;
        }

        if (empty($_GET['category_code'])) {
            Home::error404();
            return;
        }

        $account = Session::getCustomer();
        $price_list = $account ? $account->getPriceList() : 0;

        $products = Product::getProductsByCategoryCode($_GET['category_code'], $price_list);

        if (empty($products)) {
            Home::error404();
            return;
        }

        $entryTemplate =
            /** @lang text */
            <<<ENTRY
        <div class="product">
             <div class="product-header">
                 <img src="%s" class="product-image" alt="Imagen producto">
             </div>
             <div class="product-code">cod. %s</div>
             <div class="product-content">
                 <p class="product-description">%s</p>
                 <div class="product-price %s">$ %s</div>
             </div>
         </div>
        ENTRY;

        $content = '';

        $page = '';

        $currentCat = null;

        $count = 1;

        foreach ($products as $product) {
            if (!$product instanceof Product) break;

            if (!$signedIn) $product->setPrice(0);

            if (!$currentCat) {
                $currentCat = $product->getCategory()->getDescription();
                $content .= sprintf('<div class="category-title">%s</div>', $currentCat);
            } else if ($currentCat !== $product->getCategory()->getDescription()) {
                $content .= sprintf('<div class="page">%s</div>', $page);
                $page = '';
                $count = 1;

                $currentCat = $product->getCategory()->getDescription();
                $content .= sprintf('<div class="category-title">%s</div>', $currentCat);
            }
            
            //if the page is full add the page to the content and create a new page
            if ($count === 10) {
                $content .= sprintf('<div class="page">%s</div>', $page);
                $page = '';
                $count = 1;
            }

            //add an entry to the current page
            $page .= sprintf($entryTemplate,
            sprintf('/%s', $product->getProductDetail()->getImagePath()),
            $product->getCode(),
            $product->getDescription(),
            $signedIn ? '' : 'd-none',
            number_format($product->getPrice(), 2, ',', '.'),
        );

            $count++;
        }

        $html = file_get_contents(PathConfiguration::TEMPLATES_PATH . '/catalog.html');

        $html = str_replace('<!--DATE-->', date('Y-m-d H:i:s'), $html);

        $html = str_replace('<!--ENTRIES-->', $content, $html);

        echo $html;
    }

    /**
     * @throws Exception
     */
    public static function downloadXMLProductFile(): void
    {
        if (!isset($_SESSION['customer']) && !isset($_SESSION['user'])) {
            Home::error401();
            return;
        }

        $products = Product::getProducts();

        if (!empty($_GET['featured']) && $_GET['featured'] === 'true') {
            $products = array_values(array_filter($products, function ($product): bool {
                if (!($product instanceof Product)) return false;
                return $product->isFeatured();
            }));
        }

        $productsLength = count($products);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);

        $sheet->getStyle([1, 2, 3, $productsLength + 5])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle([4, 2, 4, $productsLength + 5])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle([4, 2, 4, $productsLength + 5])->getNumberFormat()->setFormatCode('"$"#,##0.00');

        $sheet->setCellValue('A1', 'Código');
        $sheet->setCellValue('B1', 'Descripción');
        $sheet->setCellValue('C1', 'Categoría');
        $sheet->setCellValue('D1', 'Precio con IVA');

        $sheet->getRowDimension(1)->setRowHeight(23);

        foreach ($products as $i => $product) {
            if ($product instanceof Product) {
                $sheet->getRowDimension($i + 2)->setRowHeight(23);
                $sheet->setCellValue(sprintf('A%d', $i + 2), $product->getCode());
                $sheet->setCellValue(sprintf('B%d', $i + 2), $product->getDescription());
                $sheet->setCellValue(sprintf('C%d', $i + 2), $product->getCategory()->getDescription());
                $sheet->setCellValue(sprintf('D%d', $i + 2), $product->getPrice());
            }
        }

        $fileToken = bin2hex(random_bytes(12));

        $filename = sprintf('%s/XLS-%s', PathConfiguration::TMP_PATH, $fileToken);

        $writer = new Xls($spreadsheet);

        $writer->save($filename);

        $file = file_get_contents($filename);

        header('Content-type: application/xls');
        header('Content-disposition: attachment; filename="catalogo.xls"');
        header('Content-length: ' . filesize($filename));

        unlink($filename);

        echo $file;
    }

    /**
     * @return void
     */
    public static function featuredProducts(): void
    {
        echo file_get_contents('public/pages/featured-products/featured-products.html');
    }

    /**
     * @return void
     */
    public static function downloadPDFFeaturedProductFile(): void
    {
        if (!isset($_SESSION['customer']) && !isset($_SESSION['user'])) {
            Home::error401();
            return;
        }

        $filename = PathConfiguration::CATALOG_PATH . '/catalogo-destacados.pdf';

        if (is_file($filename)) {
            header('Content-Type: application/pdf"');

            header('Content-Disposition: attachment, filename="catalogo-destacados.pdf"');

            header('Content-Length: ' . filesize("storage/catalog/catalogo-destacados.pdf"));

            $html = file_get_contents($filename);

            echo $html;

            return;
        }

        Home::error404();
    }

    /**
     * @throws Exception
     */
    public static function downloadXMLFeaturedProductFile(): void
    {
        if (!isset($_SESSION['customer']) && !isset($_SESSION['user'])) {
            Home::error401();
            return;
        }

        $products = Product::getProducts();

        $products = array_values(array_filter($products, function ($product): bool {
            if (!($product instanceof Product)) return false;
            return $product->isFeatured();
        }));

        $productsLength = count($products);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);

        $sheet->getStyle([1, 2, 3, $productsLength + 5])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle([4, 2, 4, $productsLength + 5])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle([4, 2, 4, $productsLength + 5])->getNumberFormat()->setFormatCode('"$"#,##0.00');

        $sheet->setCellValue('A1', 'Código');
        $sheet->setCellValue('B1', 'Descripción');
        $sheet->setCellValue('C1', 'Categoría');
        $sheet->setCellValue('D1', 'Precio con IVA');

        $sheet->getRowDimension(1)->setRowHeight(23);

        foreach ($products as $i => $product) {
            if ($product instanceof Product) {
                $sheet->getRowDimension($i + 2)->setRowHeight(23);
                $sheet->setCellValue(sprintf('A%d', $i + 2), $product->getCode());
                $sheet->setCellValue(sprintf('B%d', $i + 2), $product->getDescription());
                $sheet->setCellValue(sprintf('C%d', $i + 2), $product->getCategory()->getDescription());
                $sheet->setCellValue(sprintf('D%d', $i + 2), $product->getPrice());
            }
        }

        $fileToken = bin2hex(random_bytes(12));

        $filename = sprintf('%s/XLS-%s', PathConfiguration::TMP_PATH, $fileToken);

        $writer = new Xls($spreadsheet);

        $writer->save($filename);

        $file = file_get_contents($filename);

        header('Content-type: application/xls');
        header('Content-disposition: attachment; filename="catalogo.xls"');
        header('Content-length: ' . filesize($filename));

        unlink($filename);

        echo $file;
    }

    /**
     * @return void
     */
    public static function shoppingCart(): void
    {
        echo file_get_contents('public/pages/shopping-cart/shopping-cart.html');
    }

    /**
     * @return void
     */
    public static function customerPasswordUpdate(): void
    {
        if (!isset($_SESSION['customer'])) {
            header('Location: /', true, 302);
            return;
        }

        echo file_get_contents('public/pages/customer-password-update/customer-password-update.html');
    }

    /**
     * @return void
     */
    public static function signOut(): void
    {
        $_SESSION = [];

        session_regenerate_id(true);

        session_destroy();

        header('Location: /', true, 302);
    }

    /**
     * @return void
     */
    public static function error401(): void
    {
        echo file_get_contents('public/pages/401/401.html');
    }

    /**
     * @return void
     */
    public static function error404(): void
    {
        echo file_get_contents('public/pages/404/404.html');
    }

    /**
     * @return void
     */
    public static function error500(): void
    {
        echo file_get_contents('public/pages/500/500.html');
    }

    /**
     * @return void
     */
    public static function termsAndPolicy(): void
    {
        echo file_get_contents('public/pages/terms-and-policy/terms-and-policy.html');
    }
}
