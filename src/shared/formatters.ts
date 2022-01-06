import filesizeUtils from "filesize";


export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formattedString = minutes + "′";
  if (seconds !== 0) {
      formattedString += " " + seconds + "″";
  }
  return formattedString;
}

export function formatGrade(grade: number) {
  let descriptor = "";
  switch (grade) {
      case 4:
        descriptor = "Medium-Difficult";
        break;
      case 4.5:
        descriptor = "Medium-Difficult";
        break;
      case 5:
        descriptor = "Difficult";
        break;
      case 6:
        descriptor = "Professional";
        break;
  }

  if (descriptor) {
      return grade + ` (${descriptor})`;
  }
  return grade;
}

export function formatFilesize(filesize: string){
  // @ts-ignore
  return filesizeUtils(filesize);
}