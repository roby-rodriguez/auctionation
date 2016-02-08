var devDir = 'public',
    prodDir = 'public/dist';

module.exports = {
    // alternately could use process.env.NODE_ENV
    prodEnv: false,
    styles: {
        src:  devDir + '/styles/main.less',
        srcPath: devDir + '/styles/**/*.less',
        dest: prodDir + '/styles/',
        cache: '.cache/styling',
        options: {
            autoprefixer: {
                browsers: ['last 1 version']
            }
        }
    },
    scripts: {
        src:  devDir + '/scripts/**/*.js',
        dest: prodDir + '/scripts/',
        distFile: 'all.js',
        cache: '.cache/scripting',
        options: {
            lint: {
                cache: '.cache/linting',
                reporterType: 'default',
                reporter: {
                    verbose: true
                }
            }
        }
    },
    images: {
        src:  devDir + '/resources/images/**/*.{jpg,jpeg,png,gif}',
        dest: prodDir + '/resources/images/',
        cache: '.cache/resources/images',
        options: {
            imagemin: {
                optimizationLevel: 3,
                progessive: true,
                interlaced: true
            }
        }
    },
    svgs: {
        src:  devDir + '/resources/images/**/*.{svg}',
        dest: prodDir + '/resources/images/',
        cache: '.cache/resources/vector_graphics',
        options: {
            imagemin: {
                optimizationLevel: 3,
                progessive: true,
                interlaced: true
            }
        }
    },
    fonts: {
        src: 'bower_components/bootstrap/fonts/*',
        dest: prodDir + '/resources/fonts/',
        options: {
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }
    },
    others: {
        src: [
            'public/views/**/*.html',
            'public/templates/**/*.html',
            'public/*.*'
        ],
        dest: prodDir,
        cache: '.cache/others',
        options: {
            base: 'public'
        }
    },
    clean: {
        src: [ prodDir ]
    },
    all: {
        options: {
            rename: {
                suffix: '.min'
            }
        }
    }
};