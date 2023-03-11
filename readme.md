# Structure
project/
├──┬─ app/ - директория для исходных файлов проекта
│  ├──── fonts/ - директория для шрифтов
│  ├──── images/ - директория для изображений
│  ├──── js/ - директория для файлов JavaScript
│  └──── scss/ - директория для файлов стилей
├──── node-modules/ - директория для node-модулей
├──── dist/ - пустая директория для скомпилированных файлов проекта (соз. авто.)
├──── gulpfile.js
└──── packege.json

## How to use
1. Склонировать репозиторий
2. Установить зависимости      — ```npm i```
3. Запустить сервер разработки — ```gulp```
4. Для сборки проекта          — ```gulp build```

## What can 
1. scss to css and concat css files
2. concat js files
3. rastr to .webp format
4. create svg sprite


### Notes for raster graphics (.webp format)

<picture>
  <source srcset="images/big.webp"    type="image/webp" media="(min-width:700px)">
  <source srcset="images/middle.webp" type="image/webp" media="(min-width:450px)">
  <img src="images/small.webp" alt="test">
</picture>

<picture>
  <source srcset="images/example.webp" type="image/webp">
  <img src="images/example.jpg" alt="test">
</picture>

<img src="images/example.webp" alt="test">


### Notes for vector graphics (svg-sprite << after # svg file name >>)
<svg>
	<use xlink:href="images/sprite.svg#"></use>
</svg>

example:  
<svg class="logo">
  <use xlink:href="images/sprite.svg#logo"></use>
</svg>