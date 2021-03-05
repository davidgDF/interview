var assert = require('assert');

class InventoryList {
    properties = {};
    previousPropertiesState = [];

    constructor(obj) {
      if(obj)
        this.properties = obj;
    }

    add(obj, amount = 1) {
      this.previousPropertiesState.push({...this.properties});
      
      if(this.properties[obj]) {
        this.properties[obj] = this.properties[obj] + amount;
      } else {
        this.properties[obj] = amount;
      }
    }

    getList() {
      return this.properties;
    }

    remove(obj, amount = 1) {
      this.previousPropertiesState.push({...this.properties});

      var amount = this.properties[obj] - amount;
      
      if(amount > 0){
        this.properties[obj] = amount
      } else {
        delete this.properties[obj]
      }
    }

    undo (){
      var previous = this.previousPropertiesState.pop();
      this.properties = previous;
    }
} 

describe('InventoryList', function () {
  it('can add items', function () {
    var list = new InventoryList();

    list.add('Shirt');
    list.add('Trouser');

    assert.deepStrictEqual(list.getList(), { "Shirt": 1, "Trouser": 1 });
  });

  it('can add multiple items at once', function () {
    var list = new InventoryList();

    list.add('Shirt', 2);

    assert.deepStrictEqual(list.getList(), { "Shirt": 2 });
  });

  it('can remove items', function () {
    var list = new InventoryList();

    list.add('Shirt');
    list.add('Trouser');
    list.remove('Shirt');

    assert.deepStrictEqual(list.getList(), { "Trouser": 1 });
  });

  it('can accept items not in the list to remove', function () {
    var list = new InventoryList();

    list.add('Shirt');
    list.remove('Trousers');

    assert.deepStrictEqual(list.getList(), { "Shirt": 1 });
  });

  it('can remove multiple items at once', function () {
    var list = new InventoryList();

    list.add('Shirt', 3);
    list.remove('Shirt', 2);

    assert.deepStrictEqual(list.getList(), { "Shirt": 1 });
  });

  it('cannot remove more items than are in the list', function () {
    var list = new InventoryList();

    list.add('Shirt', 3);
    list.remove('Shirt', 4);

    assert.deepStrictEqual(list.getList(), {});
  })

  it('can undo mutations', function() {
    let list = new InventoryList();

    list.add('Shirt', 2);
    list.add('Trousers');
    
    list.remove('Shirt');

    assert.deepStrictEqual(list.getList(), { "Shirt": 1, "Trousers": 1 });

    list.undo();
    
    assert.deepStrictEqual(list.getList(), { "Shirt": 2, "Trousers": 1 });

    list.undo();

    assert.deepStrictEqual(list.getList(), { "Shirt": 2 });
  });

  it('can accept an initial list', function() {
    var initialList = { "Shirt": 1 };
    var list = new InventoryList(initialList);

    list.add('Shirt');

    assert.deepStrictEqual(list.getList(), { "Shirt": 2 });
    assert.deepStrictEqual(initialList, { "Shirt": 1 }, 'the initial list is not updated');
  });
});
