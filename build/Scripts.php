<?php

/**
 * This file is part of the simple-svg libraries.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

namespace SimpleSVG\SimpleSVG;

class Scripts
{
    /**
     * Return path to dist directory to create custom builds in PHP
     *
     * @return string
     */
    public static function dist()
    {
        return dirname(dirname(__FILE__)) . '/dist';
    }
}
