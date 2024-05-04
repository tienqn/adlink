<?php

namespace App\Traits;

trait CrudVariables
{
    protected $primaryKey = '_id';

    protected $nameDs     = 'name';

    protected $modelName;
    protected $model;

    protected $controller;
    protected $controllerSingle;

    protected $transformer;

    protected $rowsPerPage = 50;


    /**
     * @return string
     */
    public function getPrimaryKey(): string
    {
        return $this->primaryKey;
    }

    /**
     * @param string $primaryKey
     */
    public function setPrimaryKey(string $primaryKey): void
    {
        $this->primaryKey = $primaryKey;
    }

    /**
     * @return string
     */
    public function getNameDs(): string
    {
        return $this->nameDs;
    }

    /**
     * @param string $nameDs
     */
    public function setNameDs(string $nameDs): void
    {
        $this->nameDs = $nameDs;
    }

    /**
     * @return mixed
     */
    public function getModelName()
    {
        return $this->modelName;
    }

    /**
     * @param mixed $modedName
     */
    public function setModelName($modelName): void
    {
        $this->modelName = $modelName;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return new $this->model;
    }

    /**
     * @param mixed $model
     */
    public function setModel($model): void
    {
        $this->model = $model;
    }

    /**
     * @return mixed
     */
    public function getController()
    {
        return $this->controller;
    }

    /**
     * @param mixed $controller
     */
    public function setController($controller): void
    {
        $this->controller = $controller;
    }

    /**
     * @return mixed
     */
    public function getControllerSingle()
    {
        return $this->controllerSingle;
    }

    /**
     * @param mixed $controllerSingle
     */
    public function setControllerSingle($controllerSingle): void
    {
        $this->controllerSingle = $controllerSingle;
    }

    /**
     * @return mixed
     */
    public function getTransformer()
    {
        return '\\App\\Transformers\\' . $this->transformer . 'Transformer';
    }

    /**
     * @param mixed $transformer
     */
    public function setTransformer($transformer): void
    {
        $this->transformer = $transformer;
    }

    /**
     * @return int
     */
    public function getRowsPerPage(): int
    {
        return $this->rowsPerPage;
    }

    /**
     * @param int $rowsPerPage
     */
    public function setRowsPerPage(int $rowsPerPage): void
    {
        $this->rowsPerPage = $rowsPerPage;
    }
}