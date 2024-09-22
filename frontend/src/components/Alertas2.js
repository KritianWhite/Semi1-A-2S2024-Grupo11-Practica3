import Swal from "sweetalert2";

const Alertas2 = {
  showSuccess: (message) => {
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: message,
      timer: 800,
      showConfirmButton: false
    });
  },
  showError: (message) => {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: message,
      timer: 800,
      showConfirmButton: false
    });
  },
};

export default Alertas2;
