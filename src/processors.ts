export const generateCustomCitation = (citation: string) => {
    if(!citation) return '';

    try {
      let values = {
        authors: '',
        title: '',
        journal: '',
        year: '',
        publicationDetails: '',
        link: ''
      };
      
      const [authors, last] = citation.split('. (')
      const [year, rest] = last.split('). ')
      const [title, details] = rest.split('. In ')
      const [journal, publicationDetails] = details.split(' (Vol. ')
  
      values.year = year
      values.title = title
      values.journal = journal
      values.publicationDetails = 'Vol. ' + publicationDetails
      values.authors = authors.replaceAll(', ', ' ').replaceAll(' & ', ', ')
      values.link = 'https://' + last.split('https://')[1]
  
      const combined = Object.values(values)
  
      if(combined.some(value => !value)) return '';
  
      return combined.join(', ')
    } catch {
      return ''
    }
}