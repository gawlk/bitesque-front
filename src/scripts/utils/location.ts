export const addLocationToID = (id: string) =>
  `${window.location.pathname.slice(1) || 'home'}-${id}`
