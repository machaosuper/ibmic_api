module.exports = function (grunt) {


	grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },

            uglify: {
                files: ['public/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['public/**/*.less'],
                tasks: ['less'],
                options: {
                  nospawn: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**', 'README.md'],
                    ext: 'js',
                    watch: ['./'],
                    delay: 1000,
                }
            }
        },

        uglify: {
            development: {
                files: {
                    'public/build/admin.min.js': 'public/js/admin.js',
                    'public/build/detail.min.js': [
                        'public/js/detail.js'
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
        },

        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'public/build/index.css': 'public/less/index.less'
                }
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            }, 
            src: ['test/**/*.js']
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

	//加载包含'watch'任务的插件,监听文件添加修改删除，重新执行注册好的任务
	grunt.loadNpmTasks('grunt-contrib-watch');
	//加载包含'nodemon'任务的插件,实时监听入口app.js文件，实现自动重启
	grunt.loadNpmTasks('grunt-nodemon');
	//加载包含'concurrent'任务的插件,优化慢任务的构建时间，比如sass,less，并发执行多个阻塞的任务,比如nodemon和watch
    grunt.loadNpmTasks('grunt-concurrent');

	grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-jshint')

	//防止因为语法错误或其他警告而中断grunt整个任务
	grunt.option('force', true);
	// 默认被执行的任务列表。
    grunt.registerTask('default', 'concurrent');

    grunt.registerTask('build', ['less', 'uglify']);

	grunt.registerTask('test', 'mochaTest');
}