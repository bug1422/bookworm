import { api } from ".."

export function login(email,password) {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    api.post("/user/login",formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    )
    .then((v) => {
        // handle storing api_key later
        console.log(v)
    })
    .catch((e) => {
        console.log(e)
    })

}