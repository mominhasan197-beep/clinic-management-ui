import { Component } from '@angular/core';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ExerciseLibraryComponent {
  exercises = [
    {
      name: 'Hamstring Stretch',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToI3R_6D_wFLKJ6Brs4hRteb9dASzSE3dTGgFO-sRXjTw9y1DDs5aoMVHhKyjgNeuYi0&usqp=CAU',
      description: 'Helps improve flexibility and reduce back pain.'
    },
    {
      name: 'Wall Slide',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7zMlm0hLWXEk4chf_BcsiqzwhUNdYWntbu1-JOnR2qZnY32epkUyc-wRpvLxjL9BTLbE&usqp=CAU',
      description: 'Improves knee and thigh strength and posture.'
    },
    {
      name: 'Neck Rotation',
      image: 'https://img.etimg.com/thumb/msid-93662066,width-480,height-360,imgsize-18486,resizemode-75/backward-bending.jpg',
      description: 'Relieves neck tension and improves mobility.'
    },
    {
      name: 'Shoulder Rolls',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUyZQRha5Y2vMaKZS4zb9Eh6wFAOnfevu0G7cluAfx0UtIk2yA3KL9SlXghfE0WGiD5zw&usqp=CAU',
      description: 'Enhances shoulder mobility and reduces tension.'
    }
  ];
}
