<?php

namespace App\Repositories;

interface BaseInterface
{
    /**
     * Get all
     * @return array|object
     */
    public function getAll();

    /**
     * Get one
     * @param $id
     * @return array|object
     */
    public function find($id);

    /**
     * Create
     * @param array $attributes
     * @return array|object
     */
    public function create(array $attributes);

    /**
     * Update
     * @param $id
     * @param array $attributes
     * @return array|object
     */
    public function update($id, array $attributes);

    /**
     * Delete
     * @param $id
     * @return bool
     */
    public function delete($id);

    /**
     * updateOrInsert
     * @param array $conditions
     * @param array $attributes
     * @return array|object
     */
    public function updateOrInsert(array $conditions, array $attributes);

    /**
     * @param array $conditions
     * @param array $select
     * @return mixed
     */
    public function findBy(array $conditions, array $select);

    /**
     * @param array $conditions
     * @param array $attributes
     * @return mixed
     */
    public function updateBy(array $conditions, array $attributes);

    /**
     * @param array $conditions
     * @return mixed
     */
    public function deleteBy(array $conditions);

    /**
     * @return mixed
     */
    public function first();

    /**
     * @return mixed
     */
    public function last();
}
