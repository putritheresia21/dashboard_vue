export const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export const getAge = (birthDate: string) => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age--
  }
  return age
}

export const getTenure = (joinDate: string) => {
  const join = new Date(joinDate)
  const today = new Date()
  let years = today.getFullYear() - join.getFullYear()
  let months = today.getMonth() - join.getMonth()

  if (months < 0) {
    years--
    months += 12
  }
  if (years === 0) return `${months} bulan`
  return months === 0 ? `${years} tahun` : `${years} tahun ${months} bulan`
}

export const getPercent = (achieved: number, target: number) =>
  Math.min(Math.round((achieved / target) * 100), 100)
