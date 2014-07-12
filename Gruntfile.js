module.exports = function (grunt) {
    grunt.initConfig({
        blanket_mocha: {  
            all: ["index.html"],
            options: {
                threshold: 90,
                run: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-blanket-mocha');
    grunt.registerTask('coverage', ['blanket_mocha']);
};
