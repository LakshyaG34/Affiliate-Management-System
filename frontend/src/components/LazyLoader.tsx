import { useEffect } from "react";
import Swal from "sweetalert2";

const LazyLoader = () => {
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    return () => {
      Swal.close();
    };
  }, []);

  return null;
};

export default LazyLoader;