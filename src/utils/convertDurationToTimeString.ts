export function convertDurationToTimeString(durationInSeconds: number): string {
  const hours = (Math.floor(durationInSeconds / 3600))
  const minutes = (Math.floor((durationInSeconds % 3600) / 60)).toString()
  const seconds =  (durationInSeconds % 60).toString()

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

  return timeString
}