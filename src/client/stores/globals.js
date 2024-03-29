import { defineStore } from "pinia";
import { ymdFormateDate } from "../../utils/common.js";
import { wsGetCarImages } from "../axios/ws.js";
const roleAdmin = /^admin/;
const roleKpp = /^(admin|kpp)/;
const role1c = /^(admin|kpp|1c)/;
const roleRegistered = /^(admin|kpp|1c|registered)/;

export const useGlobalStore = defineStore("globals", {
  state: () => {
    return {
      debugMode: false,
      user: {
        id: "",
        role: "",
      },
      location: {
        org: "",
        kpp: "",
        cameras: null,
      },
      carSearchNumber: "",
      car: {
        state: "In", // [In|Out]
        photos: [],
        current_number: "",
        forDate: ymdFormateDate(),
        infos: [],
        infosByDates: [],
        infoCurrentId: 0,
        infoCurrent: {
          // mandatory fields to insert
          car_number: null,
          org: null,
          in_kpp: null,
          in_datetime: null,
          date_ymd: null,
          ttype_id: 0,
          code: "",
          // mandatory field to OUT state
          out_kpp: null,
          out_datetime: null,
          // ... other fields
          contragent: null,
          driver_phone: null,
          comment: null,
          is_sent_to_1c: 0,
        },
        form: {
          codeSize: 0,
          transportTypes: [],
          codeLengthLimits: {},
          isNew: false,
        },
      },
      cars: [],
      camera: {
        isComponentOpen: false,
        isCameraOpen: false,
        isPhotoTaken: false,
        isShotPhoto: false,
        isLoading: false,
        link: "#",
        cameras: [],
        currentCamera: "None",
        initialized: false,
      },
      showCamera: false,
    };
  },
  actions: {
    setCarInfoID(id) {
      console.log("setCarInfoID:", id);
      this.car.infoCurrentId = id;
      if (!id) {
        return;
      }
      for (let index = 0; index < this.car.infos.length; index++) {
        const info = this.car.infos[index];
        if (info.id == id) {
          // set info for car
          this.car.infoCurrent = info;
          if( !this.car.infoCurrent.out_kpp ){ // setup out_kpp for
            this.car.infoCurrent.out_kpp = this.location.kpp;
          }
          this.car.form.codeSize =
            this.car.form.codeLengthLimits[this.car.infoCurrent.ttype_id];
          this.car.form.isNew = false;
          // set photos for car
          console.log(
            "Get photos for car",
            this.car.current_number,
            "and infoId",
            this.car.infoCurrentId
          );
          wsGetCarImages(this);
          return;
        }
      }
    },
    setNewIoInfosFormData() {
      this.car.infoCurrent = {
        // mandatory fields to insert
        car_number: null,
        org: this.location.org,
        in_kpp: this.location.kpp,
        // out_kpp: this.location.kpp,
        date_ymd: null,
        ttype_id: 0,
        code: "",
        in_datetime: null,
        // mandatory field to update
        out_datetime: null,
        // ... other fields
        contragent: null,
        driver_phone: null,
        comment: null,
        is_sent_to_1c: 0,
      };
      (this.car.form.isNew = true),
        (this.car.infoCurrentId = 0),
        (this.car.photos = []);
    },
    resetAll() {
      this.user = {
        id: "",
        role: "",
      };
      this.carSearchNumber = "";
      this.car = {
        state: "In", // [In|Out]
        photos: [],
        current_number: "",
        forDate: ymdFormateDate(),
        infos: [],
        infosByDates: [],
        infoCurrentId: 0,
        infoCurrent: {
          // mandatory fields to insert
          car_number: null,
          date_ymd: null,
          ttype_id: 0,
          code: "",
          in_datetime: null,
          // mandatory field to update
          out_datetime: null,
          // ... other fields
          contragent: null,
          driver_phone: null,
          comment: null,
          is_sent_to_1c: 0,
        },
        form: {
          codeSize: 0,
          transportTypes: [],
          codeLengthLimits: {},
          isNew: false,
        },
      };
      this.cars = [];
      this.camera = {
        isComponentOpen: false,
        isCameraOpen: false,
        isPhotoTaken: false,
        isShotPhoto: false,
        isLoading: false,
        link: "#",
        cameras: [],
        currentCamera: "None",
        initialized: false,
      };
    },
  },
  getters: {
    getWebServiceURL: (state) => {
      if (state.debugMode) {
        return "/";
      } else {
        return "/";
      }
    },
    roleAsAdmin: (state) => {
      if (!state.user.role) {
        return false;
      }
      return roleAdmin.test(state.user.role);
    },
    roleAsKpp: (state) => {
      if (!state.user.role) {
        return false;
      }
      return roleKpp.test(state.user.role);
    },
    roleAs1c: (state) => {
      if (!state.user.role) {
        return false;
      }
      return role1c.test(state.user.role);
    },
    roleAsRegistered: (state) => {
      if (!state.user.role) {
        return false;
      }
      return roleRegistered.test(state.user.role);
    },
  },
});
