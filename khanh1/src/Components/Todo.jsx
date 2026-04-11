import { useState } from 'react';
import { Checkbox, Button, Input } from 'antd';
import data from './data';
const Todo = () => {
  const [tasks, setTasks] = useState(data);
  const [currentTab, setCurrentTab] = useState('all');
  const [newTaskText, setNewTaskText] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (currentTab === 'active') return task.active;
    if (currentTab === 'completed') return !task.active;
    return true;
  });

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, active: !task.active } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => task.active));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      text: newTaskText.trim(),
      active: true
    }]);
    setNewTaskText('');
  };

  const canAdd = currentTab === 'all' || currentTab === 'active';
  const hasCompleted = tasks.some(task => !task.active);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center"># Todo</h1>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 font-medium flex-1 ${
                currentTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        {canAdd && (
          <form onSubmit={addTask} className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1"
              />
              <Button type="primary" htmlType="submit">Add</Button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={!task.active}
                  onChange={() => toggleTask(task.id)}
                  className="mr-3"
                />
                <span
                  className={`flex-1 ${
                    !task.active ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                {currentTab === 'completed' && !task.active && (
                  <Button
                    danger
                    size="small"
                    onClick={() => deleteTask(task.id)}
                    className="ml-3"
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {currentTab === 'completed' && hasCompleted && (
          <Button
            danger
            onClick={clearCompleted}
            className="mt-6 w-full"
          >
            Clear all completed ({tasks.filter(t => !t.active).length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default Todo;

