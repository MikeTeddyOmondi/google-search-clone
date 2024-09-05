class SimpleDB {
  constructor(storageKey = 'searchHistory') {
    this.storageKey = storageKey;
    this.data = this.loadData();
  }

  // Load data from localStorage
  loadData() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  create(record) {
    this.data.push(record);
    this.saveData();
    return record.id
  }

  read() {
    return this.data;
  }

  update(id, newRecord) {
    this.data.map(item => 
        item.id === id ? { ...item, ...newRecord } : item
    );
    this.saveData();
  }

  delete(id) {
    const index = this.data.findIndex(obj => obj.id === id);
    if (index !== -1) {
        this.data.splice(index, 1);
        this.saveData();
        return true;
    } else {
        console.error(`No record found with id: ${id}`);
        return false;
    }
  }

  find(id) {
    if (id === null) return;
    const result = this.data.find(item => String(item.id) === id);
    if (result) {
        return result;
    } else {
        console.error(`No record found with id: ${id}`);
        return null; 
    }
  }

}

export default SimpleDB;