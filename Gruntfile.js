module.exports = function(grunt) {
    function spriteSmithCssTemplate(params){
        if (!params || !params.items || params.items.length === 0){
            return '';
        }

        var result = [],
            item = params.items[0]
            defaultWidth = item.width,
            defaultHeight = item.height;

        result.push('*[class*=em]{');
        result.push('width:'+defaultWidth+'px;');
        result.push('height:'+defaultHeight+'px;');
        result.push('display: inline-block;}\n');

        for(var i in params.items){
            item = params.items[i];
            result.push('.em-'+item.name+'{');
            result.push('background-position:-'+item.x+'px -'+item.y+'px;');
            if (defaultWidth != item.width){
                result.push('width:'+item.width+'px;');
            }
            if (defaultHeight != item.height){
                result.push('height:'+item.height+'px;');
            }
            result.push('}\n');
        }

        return result.join('');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sprite:{
            all: {
                src: 'out/emojis/*.png',
                destImg: 'build/sprites.png',
                destCSS: 'build/sprites.css',
                algorithm: 'binary-tree',
                cssTemplate: spriteSmithCssTemplate
            }
        },
        replace:{
            js:{
                src: 'src/knockout-emoji.js',
                dest: 'build/knockout-emoji.js',
                replacements: [{
                    from: '##emoji-list',
                    to: function(){
                        var fs = require('fs'),
                            list = fs.readdirSync('out/emojis'),
                            result = [];

                        for(var i = 0; i < list.length; i ++){
                            result.push('\''+list[i].replace('.png', '')+'\'');
                        }

                        return result.join(',');
                    }
                }]
            }
        },
        image_resize: {
            '16px':{
                options: {
                    width: 16,
                    height: 16,
                    overwrite: true
                },
                files: [{
                    expand: true,
                    src: ['emojis/*.png'],
                    dest: 'out/'
                }]
            },
            '32px':{
                options: {
                    width: 32,
                    height: 32,
                    overwrite: true
                },
                files: [{
                    expand: true,
                    src: ['emojis/*.png'],
                    dest: 'out/'
                }]
            },
            '64px':{
                options: {
                    width: 64,
                    height: 64,
                    overwrite: true
                },
                files: [{
                    expand: true,
                    src: ['emojis/*.png'],
                    dest: 'out/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-image-resize');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', ['image_resize:64px', 'sprite:all', 'replace:js']);

    grunt.registerTask('16px', ['image_resize:16px', 'sprite:all', 'replace:js']);
    grunt.registerTask('32px', ['image_resize:32px', 'sprite:all', 'replace:js']);
    grunt.registerTask('64px', ['image_resize:64px', 'sprite:all', 'replace:js']);
};