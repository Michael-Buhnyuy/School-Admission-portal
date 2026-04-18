# CI4 Autoloader Error Fix - TODO

**Plan Steps:**

1. [x] Edit `ci4/system/Config/BaseService.php` - Update autoloader() method to pass `new \Config\Autoload()` and `new \Config\Modules()` to `new Autoloader()` in both shared and non-shared cases.

2. [x] Test CLI boot: `php ci4/spark` - Success! No fatal error, CLI boots (output expected Spark help/CLI prompt).

3. [ ] Run `cd ci4 && composer install` to ensure dependencies.

4. [ ] Test web server: `cd ci4/public && php -S localhost:8080`

5. [ ] Verify no errors, cleanup.

**Status:** Step 1 & additional fix (corrected Autoloader.php types/use to AutoloadConfig) complete. CLI spark boots successfully. Proceeding to composer install and web test.
