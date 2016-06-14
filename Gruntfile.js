module.exports = function(grunt) {
    grunt.initConfig({
        "jshint": {
            files: ['*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        "jsbeautifier": {
            files: ["*.{js,json,html,css}", "public/*.css"],
            options: {
                css: {
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    fileTypes: [".js"],
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0,
                    endWithNewline: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jsbeautifier', 'jshint']);
};
