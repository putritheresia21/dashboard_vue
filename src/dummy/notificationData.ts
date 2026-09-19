const notifications = ref([
  {
    id: 1,
    title: 'Upwork',
    avatar: '/images/upwork.png',
    type: 'expense',
    message: 'Successfully purchased a Business Plan for ',
    time: '1m',
    unread: true
  },
  {
    id: 2,
    title: 'Brandon Stanton',
    avatar: '/images/brandon.jpg',
    type: 'income',
    message: 'You have received money ',
    time: '11m',
    unread: true
  },
  {
    id: 3,
    title: 'Gustavo Schleifer',
    avatar: '/images/gustavo.jpg',
    type: 'income',
    message: 'You have received money ',
    amount: '+$5,129.00',
    time: '12m',
    tags: [
      { label: 'Pending', severity: 'warning', customStyle: 'background-color: #fef3c7; color: #f59e0b;' },
      { label: 'Income', severity: 'secondary', customStyle: 'background-color: #f3f4f6; color: #6b7280;' }
    ],
    unread: false
  }
]);