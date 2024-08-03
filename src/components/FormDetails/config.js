export const fields = {
    firstname: {
      type: 'string',
      required: true,
    },
    lastname: {
      type: 'string',
      required: true,
    },
    company: {
      type: 'search',
      entity: 'company',
      renderAsTag: true,
      redirectLabel: 'Add New Company',
      withRedirect: true,
      urlToRedirect: '/company',
      displayLabels: ['name'],
      searchFields: 'name',
      dataIndex: ['company', 'name'],
    },
    country: {
      type: 'country'
      
    },
    phone: {
      type: 'phone'
    
    },
    email: {
      type: 'email',
    },    
  };
  