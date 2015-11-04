var URI = require('urijs');
var hoek = require('hoek');

function Collection(items, offset, limit, total) {
    this.items = items;
    this.offset = offset;
    this.limit = limit;
    this.size = this.items.length;
    this.total = total;
}

Collection.prototype.isPartial = function() {
    return this.size < this.total;
};


Collection.prototype.toHal = function(rep, done) {
    var uri = new URI(rep.self);
    var prev = Math.max(0, this.offset - this.limit);
    var next = Math.min(this.total, this.offset + this.limit);

    var query = uri.search(true);

    if (this.offset > 0) {
        rep.link('prev', uri.search(hoek.applyToDefaults(query, { offset: prev, limit: this.limit })).toString());
    }
    if (this.offset + this.size < this.total) {
        rep.link('next', uri.search(hoek.applyToDefaults(query, { offset: next, limit: this.limit })).toString());
    }
    done();
};

module.exports = Collection;