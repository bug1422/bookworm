import { api } from "@/script/api";

export function handleSignIn(formData) {
    api.post("/user/login",formData)
    .then((v) => {
        console.log(v)
    })
    .catch((e) => {
        console.log(e)
    })

}