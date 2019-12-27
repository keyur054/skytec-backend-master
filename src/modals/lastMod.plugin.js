module.exports = function lastModifiedPlugin(schema, options) {
    schema.add({ updated_at: Date });
    schema.add({ created_at: Date });

    schema.pre('save', function (next) {
        var now = new Date();
        this.updated_at = now;
        if ( !this.created_at ) {
          this.created_at = now;
        }
        next()
    })

    if (options && options.index) {
        schema.path('updated_at').index(options.index)
    }
}