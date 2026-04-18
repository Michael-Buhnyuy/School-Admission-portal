<?php

namespace CodeIgniter\Autoloader;

use CodeIgniter\Config\AutoloadConfig;
use CodeIgniter\Modules\Modules;

class Autoloader
{
    /**
     * The PSR-4 defined namespaces.
     *
     * @var array<string, array<int, string>>
     */
    protected $namespaces = [];

    /**
     * The class map.
     *
     * @var array<string, string>
     */
    protected $classMap = [];

    /**
     * List of classnames that did not exist.
     *
     * @var array<string>
     */
    private $invalidClassnames = [];

    /**
     * The registered autoloader.
     *
     * @var bool
     */
    private $registeredAutoloader = false;

public function __construct(AutoloadConfig $config, Modules $modules)
    {
        $this->namespaces = $config->psr4 ?? [];
        $this->classMap   = $config->classmap ?? [];
    }

    public function register(): void
    {
        if (! $this->registeredAutoloader) {
            spl_autoload_register([$this, 'loadClass']);
            $this->registeredAutoloader = true;
        }
    }

    public function loadClass(string $class): void
    {
        if (strpos($class, '{') !== false) {
            return;
        }

        if (isset($this->classMap[$class])) {
            require $this->classMap[$class];

            return;
        }

        if ($path = $this->findFileWithExtension($class)) {
            require $path;

            return;
        }

        $this->invalidClassnames[] = $class;
    }

public function initialize(AutoloadConfig $config, Modules $modules): self
    {
        $this->namespaces = $config->psr4 ?? [];
        $this->classMap   = $config->classmap ?? [];

        return $this;
    }

    public function addNamespace(string $prefix, string $path): self
    {
        $prefix = rtrim($prefix, '\\') . '\\';
        $path   = rtrim($path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        $this->namespaces[$prefix][] = $path;

        return $this;
    }

    public function getNamespace(?string $prefix = null): array
    {
       if ($prefix === null) {
        return $this->namespaces;
    }

    $normalized = rtrim($prefix, '\\') . '\\';

    return $this->namespaces[$normalized] ?? [];
}
    

    public function getClassMap(): array
    {
        return $this->classMap;
    }

    public function addClassMapClass(string $class, string $path): self
    {
        $this->classMap[$class] = $path;

        return $this;
    }

    private function findFileWithExtension(string $class): ?string
    {
        $file     = strrpos($class, '\\') ? substr($class, strrpos($class, '\\') + 1) : $class;
$segments = explode('\\', str_replace($file, '', $class));

        $file .= '.php';

        foreach ($this->namespaces as $namespace => $paths) {
        if (! strncmp($namespace, $class, strlen($namespace))) {
                foreach ($paths as $path) {
                    $testPath = $path . implode(DIRECTORY_SEPARATOR, array_slice($segments, strlen($namespace))) . DIRECTORY_SEPARATOR . $file;

                    if (is_file($testPath)) {
                        return $testPath;
                    }
                }
            }
        }

        return null;
    }

    public function loadHelpers(): array
    {
        $helpers = config('Helpers')->helpers ?? [];
        $files   = [];

        foreach ($helpers as $helper) {
            $result = service('locator')->locateFile($helper, 'Helpers');

            if ($result !== false && is_file($result)) {
                require_once $result;
                $files[] = $result;
            }
        }

        return $files;
    }
}
