import React, { useState, useRef } from 'react';
import { Search, Loader2, Volume2, Copy, Check, Download } from 'lucide-react';
import { getHanziInfo, HanziInfo, getPronunciationAudio } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';

const umamotoImg = `data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCADIAMgDASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAAMEBQYHAgEI/8QAQxAAAQMDAgMFBQUFBgUFAAAAAQIDBAAFERIhBjFBEyJRYXEHFDKBkSNCUqGxFWLB0fAkM3KCkvFDU2Oi4QgXJrLC/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAMCBAUBBv/EAC4RAAICAQQABQMDBAMAAAAAAAECAAMRBBIhMQUTQVFhIjKBkeHwFCNxoWKxwf/aAAwDAQACEQMRAD8A+qKKKKIQoooohCiio66XeLbmlrfcACAVKJOAkDmSeldCljgTjMFGTHz7rbDK3XlpbaQkqUtRwEgcyT0FUKbxZcr8laeFENxbYCUrvMtPdPmy2fj/AMR7vrUKZb/H3ZXG4lbPC7bhVEiJJSZ5G2twc9Gc4T161LvuuOlAdSkIRs2hHwpHIbVn6rWCk7F5MvaXSm0bm6kbbrXbYdzE/Q7d7tp3uM9XaOD/AA9EjySBUlIkSX0ntXVKycFIGPpSHYKAGkDunIxtXbXdKhhw/wCI5+dZD3PYcsZrLUifaIitC1uHUcJI25bmu30pUgJUApZ3360opIBxkqzzwOtdKy4AHUbDqfH5UqMzG4yjUV6Nsaf9q8DaFEpOskjI35eI3pyEpKSNITtvtmk20aU7/F49aMidyZyltIVsjG4OdPSkp0RifF92uzDE2JnIQ+nJSfFJ5pPmKc61Y7+dz050g+Qg/eXk4wTU1cqcqZwqH4YRCLJv3C/9ptLki+2FOS9b31apcYf9JX3x+6flWgcOX+28RW1E20yUvsnZQ5LbV+FaTulXkapEOS4y+XEDdI2PLz3FNbtbHWpTvEHCIbYvaAFSYyVYRMT1BA+94GtbSazfhbJk6vSbPqSarRVN4R40ZvtualISQlXdW2vZbShzSfMVbWX23h9moE9R1rWetk7mWtitwIrRRRS5OFFFFEIUUUUQhRRRRCFeKISCScAV6SAMnYVDXi5oigYOpZGUt+R+8r+VTRC5wJB3CDJidyvPZhbaULRjr1I8fIVm3ELTvE99jWJayLeU+9XEgkfYg4S2MfjP5A1YJUorUuQ8sFStyT4VFcFlUizzLy5nXd5KltZGNMdHdbH5FX+am65xo9OSvZidGh1d4DdCTfdAbQhIbabTobQkbJSOQxXiyCeW9dAZHn5160MnK68WSTPXjAHE5AORgbGu0oCD2i0kp5ZxSiFAOakgHG+DTx6a2pjCW9WdsEbCpKoIyTFszZwBI9wJ0go5+FeFOU8u94V6NzsMeZr0DOcGuCT6iJG23OuMEEZ+lKEgDPM9K5Ucp3+tRxJicOEeGw50i2pLigpGCvHwY3516+4EFABGpatIz40ooa1JSQArBOUjGN+hqSiB44nvZkoSNa1HVjbmPXxrxh5TKkOodTqHMn4TjbGOlBynGpWdWNiMEj+dcuFDAXoxkgnGNlb8z54qxWuYpj7yD4iT+wL9FvsNCG7ZcHOyuDSRul0/C4Omc7GrSzOfiq1nUpHgDuPQ1AzXW71YZduWytbEtoobKtilz7p8twMH0ppwPcl3LhmO5IKveWgY7mrnrRsc16vwu7zENT+k8t4pT5TixfWapZp4mxwrWlZG2Rz+Y6VI1l7E5cSSVMfZuDmUn4vL0q5Wi/NSGkJlfZLIxqUdiabqNIyfUvUTRqlYbW7k9RQCCMjcUVSlyFFFFEIUUU3nykQoq33fhSOXjXQCTgThIAyZH8QXVMFsNoSHHjvozy8zVMkyXXHlLcJ1rOVEnOaUedXNlOPu4yo5I/hXLqEhQUASeXrWxRUKhj1mTdabTn0kJxPKEXhu6Pg6VJjLCSehIwD9SKnoEYQrNaoOMe7xGkY8DpGfzqne0NBk2WPExgSp8WOvH3kqdGR+VTnFfGdls15fiSX1qkoICm2kFWnbkfDptWF48WcrWozNrwNQAzmTqRjrv5V2Phyaqlp4/sE95LSZKmFE4y+jSD8+Q+dW9OhbSVtqSpCtwQcgivNGtl+4Ym/uB6iCikbjINeEjfc0otOVE4xTC63CLa4ipM50NMjmrmSfADqajgk4EmCI9SnY6ckGvCDvyxyrK757WFtK7KzxGRn/AIj5KlEf4RVWe9qHEgkHLsZLYJJBjgAj1q2uhtI9ok6hAZvCgQTnlSZJxVF4L9o8S8JMW6pEWaMDWn+6X5g9P0q8rwcKSQQdwR1qrZU1R2uJYrcOMiN3XCH2tOkqBzpI/MedKoc7u+5PeKBzHmPKh1tK04OQTsFA7imbTZZd1LVr0jYA7pPUA+YoU8SREk0vagnQ4Cgb5xuNvzpu6BJ7TtSdxlOn73UEUgy4ojUpIUpJ+LkOfPHQ78q9bV2bfYqUgISBjSNITvtv0qygaJbAnDLSmlI0d05+DoDVV4NdW1xXxXEKFhKZKJBBGydY3x+VW1xStCCHdz1UdWfnVf4Y7L/3AvgU0dT0RsqKSMZBGAR+h/lW14W+26Y/iqbqDLMllvV2icZPLNLttutEqTqTtt50IS3HcUCvCcd1RHOrbY4kdERLza0vKXvrxy8hW/feKxk8zzlNJsOBxGvDtxXlMV9KwD8ClAgjyPl4VYqQcYadWlbjaVKTyJpesqxw5yBialaMgwTmFFFFQjIVDXdHvlyiQXAr3dQLi8fexyGamabe9IVyGVA8jUlYqciQdQwwY1ctEIMKDbCELCTpX1HnmqatwhaiVJIG5UeQ/wDFXtYElhxpeQFDBKTjnWL/APqDsE6Lwm3Ktin3IKHCJjaV6cAjCCfxJCsZHnVmi/bkOcmV76NxGwYEg+OeMrH7xbGIU33uTGuLEl1qI2XlAIVk7J/Sq1aUQLlcJE682Xii4OyHVOLbjwChJJP3lKUCfTAq18OsXThaPboLtjbYtocYke+toGpRyFZUpPPOevpVk9o3HFr4QfQial+VNkrV2EVgZWrfmfAZ2rN8Sucsu0ZJmn4cgRGUngSnCNwW0tTkjh3im2agdS3IrhA/0lVXXgaRZ1WxxiwXX32MlZWG1KypnPMY2IGehFVuH7SZLyQuVwnxBDZxntW2i6APEpwDj03qu8aQonEXFnDkzhuV7sLiy4JEiNlCylChnwOvmnBrLZWf6bMj85H8/M01IH28/wCpsz77ceOuRJcQ0y2nUtxw6UpHiSaody4wt97dDdk4fn8RJbJAeQ1pjg+S17H1A+dUn2lcAGxcPKnxrpcpzKXkCSxJc1J7MqwVDHXl8jWxOOR7RZ0rdT2EaNHC9KUE6UhORhI8vCklErQOp3Z49pNWZmKniVGM5xkR/ZOFeH4CehelZUPXQk10+xx26SVweE3EfhUpw7fNNRT1y9ot7WV2K2xrRBV8L1xUC+sdCUb6fTFMHXfazZFe8Oqt14aScqZQE5I8tkn6UwL77Qf8/vIlvbJjbiJi521C5104CgrDI1Lk2yQUlI6q0jp45FS/BHtEsL0FuPLkSIAUpXYe+pwnGfhDg7px8qnOFeO7fxCzIjy471uurLai/BkDCsY3KSfiFZr7LOCbfxFwx77fFylMds4iKhDmhLaAdzjxJ/SpEo1beeMYx18/5kl3hgKjnPvNijX+0SThm6QnDtjD6f505ckMOt/YSGFknbC0q/jVGHsY4YWoONOT0Hbk+D/Cmz/sVsrDS3Y1xuTZSCQO0B/hVdUozwx/T944vb6gfr+0vKnnWlEFJIGDkHY77/Sk3H1dqEhCsaykqBGCk9frWep9lpbdDUDiC6suJ3OVjl47fIVOReFIFitCVcWXiZcyVbJffWEE9EpQDlRxVlmqrA+rP4iQLHONuPzLOX0LWQhes9BnA2Hj9aq/Abb9w9qHEZZa+1jxmWRp2G/M/VPP1rpLvDLr8dMa2PW1aiUNSUNlnSo7DJB5n94VafYxbRZ+KOK2J0oSLnJ7CShWjTqjkEAj/NkEdPnV7w/UJvJXse8o+JaawIFcYBllk22QztKCwM7Ebg+VWDh+PJYhtpcWkM47rencepqVUlKsagDg5HrQpaU/EQK07NS1i7SJj16Za23AxCRILYOjBxtSEN99chIVkt4OT4U6a7NzUoJwc9a4fUdYSkEJ5nApQI6xGkHvMd0Vyg6kAkYJoqMnPVcjUcuKptQLa9jz1dK8va1Iba7NRSrJIIOOlV39tyGXwhwJWBz/AJ5qxVS7jKyvbcqnDSzJeUgEbA+FNb9bWOIOH59tkhOiWwtk5GdJUCAfkcGmKbsgKV7y1g4zlJzkVy3em1FSA0dPNJUcVw0OehAahB2ZnNuu79z9mQtzxSniC3FFnmRl7LS6lxKUKI5lKkgEHrXrVlixOJ5t2dK5NzdJbEh/ClNoG2lA5JHpTT2o2+FPudguKYpZuLlzjxlzmFFt5TRJBSVJwT5HmKar4dKX1JN4vWM7j3xX5nGaxvFyyFUY44m/4Kq2q1ijPMuTc0NN63nAlAGStSsAeprOg+eJ/aDGmQSkQGVAMqCcFxltWpx4eSnNKQeuk4yM1PMcMWrWh6XGXOWjdJlure39FEjPyqQ4FahN2v8AaEzU9cLghLriwcAbd1CR0SkbAevjWVS6oCQeeppX1EsMjj4knxBb2rzZJ1vk/wB3LZU0T+HI2PyODVM9nF0kW96XbOLZSYt1SGm0Ikq0h4ITo7RtR2UClKNgcgg7Ve4z5zhSQR5inE2HEnMBEuOxJZznQ62lYz6EV2q3CMh5Bi7qvrDDsRB+WiOn4kkn94GoubdIzaVKlS47IxnvupT+ppvN4O4ed3/Y0LHgGsD8qZN8H2COrU3Zrft17BJ/WknYPU/p+8sV7vYZ/nxKvxjxbHk2+Ra+GVpuV3lpLDfuw1hoK2KlKGwAB8atPCtuRYrHBtrJB92aCVEclq5qP1zXMSFc4/EKmmGLexYOwGA2jS6XfQbYqY92IO/LxFdsYbQijjuOrALF3PPUdw3UoyU7Anl509kqBiOjAWCk900ybSkYwetOUJC0qRvpIwagnETaAeYlDjpjIcW5keBJyQkDYZ61lkeQ9f8AiATryHooeVogOJOpDCTsELT0Kup655itQv1wiW2zypVxeQ0wlBBKjgqJGyR4k+Aqg8Jdu5ZIDtwQW5i2k6kq27/T5nanZOC3vO6fAJz6SSulmcttrW+t5tQQFKO2ACBkVPcEJec9p8J0uHAsCi8hP4i6jTn/ALselObpBNxhCK8tKW1KSXlHkEg5UB64x86f+yyE4/JvPE8pBQm4KTHhpIwfdmidKv8AMok+mKteGIxs3ewlLxXU76grd5mgKfQCpIPeHSoqS+oqGTlRrp5CnlnssoIztz2pJiA8pZJUDjqetekVQvJnl2Zm4E8blvJV3SB4ZHKk0reKypSzq8c86cLaabc+0cAX1SDn8q6cLSPi0BJ8eZ9KnkegkMH1Mf215braw4nBSRgjqDRSsbSUpUnGFIG1FV2OTxLCggcxhf8AWoR2kKx2i9JzyxUa7wulbWfeD7x+PGx88VYJUVqQptToJLZynBxSg2FNF7IAEOIs0K5JcSkOwH7dj3mL2yDklaVbHyz0pjKcQpSTHQpLIVkpUcqHzq8TsTIb8dvOtSe70yag2eHJBRlbzSFHmACat1alSM2cGU7dMwOKxkTO/aMtxmwNXFsAm3zI8zHkhYz+tWKVFSt9a0JBbWrWgjqk7g/nXd/s3vcO4WqV/wAdlbR0741JIB/SmXAs43Xgy1vOk+9xE+5SU8sON93f1ABrG8ep3qtomx4Deai1ZniXmvfvdGzreQnW4E79mnpqPQnoKh4HCsu23V5dneSbVJWXVxHVkGO4eamzv3T1SflU3KtkqPDuzlmcYauMxfbNrfQVNhelIwoDfHd+Wa6t90kCO2i6W2TFk474bHbN566Vp6eoB8q86owOOp6NrSSMdz2Ja32HC7ImvOZ/4YIKR+VSraQGgkDAHIU2Vco6BlQeIxyDKj/CkV3dGcNwLm6f3IxA+pwKApMi7MfukiWgoacAED61C3OPdG3C7bxHktjnHdPZqJ/dXy+RHzpX3u7Shpj21qH4OS3go/6EZz/qFN7Lw89DvEq63G5Pz5z6ezAx2bLKPwobBOPMkkmpbR2ZAOynEVtElq4xFOhp1l1DhadacGFNrHNJx8txzzT1bGoHmKWjRGo70lbaSFSF9o5k5yrAH6AUupPjSyB6RnmHMjkxzqIGPWl8aPpSqhoVgDzqt8e8So4Xs4kpYMuW6sIZjIPecPNR9AkH8q6qFztXuDWcZbqecU8MxeIn4DkyTKZERalhLKgAvIH0O3Mb7ml7dYLbbWybRDYYfCcB5YK1DxOSck00svGfD94t6Zca5R2sjKmnnAhTfkQagLxfXuLpKbBwi4tTLhxOuSAezZa+8lKuqiNv08nU0ai1xUAYq7UVV172PAkutL3EYXbbRIUi0trxMn6sqdPVts9SequXQVe0OvsobbYUliOw2G0pThISnkMA0nbIUa22xiLDbDTDCQ20lI+EAYFOmIJuUkoccVhI1KUd/lXr9NpatLXtH5M8hqdVZq3z+gnrF4j25vS12skk7E7Dzpy1JuF5Y0oZ91ZUN3FHOR5VzL4cVjVGe1EYISsYyfUVYmxpbSCACANhyrltlYAZOTO1V2ElX4EqNws8m3tLfbf1I5qI2xUb2pwHEqKiNxner5L7FTKm5CgELGCD1ppBjwIbChHSlIVzJ3JqVeqO36hkzlmlG76TgRhwvNkSXtL5JQlru/X/AM0VMRWdK0OIUOyCCEgDHhRVexgzZAxLFSlVwTmKzElTJwSCDmmsaRoCu1VlCR151IKGpJHiKhHWFJVnCselCAHgwckciSMbsFZWyc+O/Kls71AOh1l0K1b/ALp2Ip23McbWO6pbauR3oao9gwS0dERpfnEuTW20hKVoSdSiN8HkKzy/B/gq+P32PGdf4dnaRdW2xkx1jZL6R4eNa+6llaQXUoUOmoZrpSG3mlIUlK21p0qSRkEeBHhQ7q9XlsOIVoUt8wGUaM+xJYbfjutvx3UhbbratSVpPIg0opBJz1qp8XWG4ez0vXfhhlUvhtSu0mWsElUbJ3cZ8vFP9Cx2a5sXW1R50J1L0WQnW2seHX0IO2K83qdMaW/4n1noKbxaMjuNXZz7LykuxjtyOrY/lTmK8t/JUyWx0Jp0SDtzzXoRjNVQJaLjHU8SMHevScE45V7sBvyNeEjmOQo6kO4m6cEYO1BWcDfNN5slmO3rfcCU9B1PoKrsq9OSS43BV2KMEa1Y1Y8qjzHJWWElrveItrRqcUp6Qfgjt7rWeg8h5naqZHt8i8Xn9p3MJemLToaaSctxm850p8T4q61KWyCl9aksIJUTlx5w6lH1PM06luuRHE2mwtNvXh5Otal/BGb/AOa54DwTzUabUGc7KxyYWFKBvsPUolp4TYvHtOEMwmH7dBBfmAp2UTshs+OTvSLNzu3A/Gl9s9tWmZZLbJ1rghA1FpYCyW1cwpOrkfStisFut3APC86bKcUtEVCpsyQ4e/Iex1Pj0A8wKwDhu4SJF2kXWeC5InPLffHVJWc4x1wMD5V7HQ0lFCZzgd/M8pq7Re5cjv0n03wXJh3q1InxHA/DeAU0dOxSf49COmKnI0FqM+440VAL+5nYV888McYvez2+KZkH/wCMTnT2qQM+5Ok/3if3D1Hzrb03VL7YV26i2oBSSkZCgeWPKuWI5Y+0SpSsDMkZ8x1hwJQlIHPJ3zTRU6S+AW+6BzCRmklyomlRU+SByCUbmmTs7W2WoaFp1cyT3vliupV8SD2/MkVuqccyr4gMH1o57Uyh2+a+yvsypoEDdYwVelMULktXNIcUsOIWBg0wIDkKeotrCMFh3LbaiotKBPdHKiloaNCFk9VE7UVTbuXV4EcVHXeY1EYKnNRwRnAzzqRqKv0cPxiMdCMjnjr9NjUqwCwBnLCQpIkTFu0Z1BEhohQzgp3AFdi5x2nyg6+zUAUmoJtlTSFNuIXr55AztTmHb35riAoDUep5AeJq+1SDkniZy3WHAxzLM281p1JdQU4B2VnGa5XcW2ClQBcQfvIORTRmxvIAHvCNhj4TTGVHehOdkvG+6SN8jNV1WtjgHMsNZYoyRiTH7VYdVoeR9mevP8qyi7KTwBxC9Lisur4QuCyuQEIz7g+fvpSPuK6/7ZvqSnk4hST5VXuJuNuHbKr3KS8qbMWMCHFb7VxXkUjYfM1yzT1upVujO1amxWDDuSMC5224R0vQJ8OQ0sd1TTyTn5ZzTxSm2hqW42lI55UBWKWrhqJxzeZF1fssbh7hy2qK5Tsc/bSlkf3Wod3PLOBtnGc1DcVcK29m2vyoDcoutudqmM4+pYLST3kn5dayl8EZ9xrbgTWPiqJtFgwTNdu/HHD9veUyq4tyZXSPE+2cJ8MJ2HzIFQkjim5Twfdm02yOT97Dj6h/9U/nTSLYYEK1RpNnitNW+S0lxPZpGwOCMnmfWk1N6XCMYRjnnY1hMyg4UfrPR00LjcTmCFLW4p0qccOdRK1FSifWrBZIPvKS9ISGmE5VnqfGm8KDHhxHJ1ycEWIgBag6dO3jn+s1M2+0TOKI5cmpetfDZxgHuSJifADm2g/6j5VKmizUNhBx7yGq1ddAxI1mbMvUl6Dwe02VBfZuzljLEUeA/wCY6dzpGw6mrhZOH4fD0NxuLqeVrDkqQ4rU7Kf8VHrjPLkNsU+jtM2+KzDtkVqI0lJQyw0kJS2nrsPqT1pheJ8Sy2iTcLi9ogwUKcUpR+JXX1Odh5mvS6XSLQOO55bVapr256mae3q+l8WvhhhR0uq98m46pHwg+qt8eAHjWZl/sgrAKj8O+2c13crk5d7hJuskKEqW6XnB+BHJKB5AYpukLKu05J5p64rcor2JKDHJkwpYdsshL4TqSyspCj8XdJxU1wjJuVqiNK4VuSZTAQkv2e5OHA2GS04d0+Q5VS31KVbpZdwfs1EZOM7HnUpH/srbbwbWrtDpUpOwTjbIPjtXHrB9YDrBGRNy4Mvlv4kWYS+2hXZAy5ClAIWkeI/GPNOaututPucnWoFz8KgeXyr5yauSbmlMG8kaW1ZZJJSttXRSFjdJ26H5VcLN7QeIeGwhq4pc4htQOO3TgSmU9Djk6PofWqdqWgd8SaV1A5Am6kmmq4kZ2WmQtGp1PInpULw/xRb+KLWJlnltvMnurCdltnqlaTuk+RqXSHMDQFEjlv1qmEYeuJYZlPYkg2kJTgDFFeoGlIGc4FFckp7XDzYcbKTtnrXdFEO5Un2JNsnFxpGrKvi56h4VIQ7g2p/KoSmXCN1dDUw+0HQOihyNQHFl8svDsRMi7yEslRw02jvOuq/ChA3Uac1gfscxC1FD9J4kx7yCRpSSPzqp8Ycd8P8ADUtLbpXOvSk4bgxB2j2Ofe6IHmcVQOI+JuIb828hIHDlowR3HAZTyehUvk3kdBk+dUcyItpbcj2SMGVnvFwDUt07kkk7k+ZrqUFupNn2/dLNxVxXcbsFSL/ORZ4Chn9nQF5fWP8AqvdBz2AFVvhS2v8AF15FstDCbTb1ZcecbJCmmORWpR3UtXwjPLPrVVQ4/e5ZeecHYJJKQrktXieuK0jgVtl238SwdbZfdZZWogZ1NAqB+iinPrVxaNq8fES1vZxNO4jgxbTwnGg21lDFpiKCG0DfVgE5z1369TvWZy0luPJlTBoSW1uKGPgQAdv66mp/gBUibYbzaX3tUe2KZkNIO4SFasgfu5TkDoTUdxxCWOG5YAJW8jUAOZA7xT9Afqafp80qyeozKOo/uOrehxE/ZDOWvhs2qbj3iHhSUE5+xcGpHyG4+VT9+Ta7HCNwcjF97VpZZCviX89gBuSTyAqF4ZhsW8NXpvV2b0fsg20AdYKgUAeedh/iqwSrNIlLccubjYk6FIQhB1NxMjcZ++s4wTy8PPxGk0n9ZqCxGFzz/wCz2+u1P9FXtU8+kf8ABFltl/aa4gvE9i7yGFktsIBEaCsdAg4Klj8ShnwAq5ypJcBW4khI+BHX1Pn+lYt7ILqWeLbpDkFSA+x2hbPLtG1AfM4UfoK15SlHC1py4dkJPJI8T/XlXpW0y0NsXodTzfnm0bm7MbqU4t4hJCVkd9Q+4nwHn/vWG+3DiJV2vrHDUfItsBKZUwp5KX9xB9AdWK1rjK/ROF+H5l0mnMdgboB7z7h5IHmTz8BXznb3lzhKlXAqVcpzipL6vFSidh5AYAqxQm5vgRR4GYkNKtRaTrSU5Cgc5pZletfY4HeG/nvTRDi4zyiASyD3kgZKPMDqPEc6dJfioT7y8+22k7hQXjUPI1f3e8XiJ3Zk/sh18qCFghBT1wVYH61PsIQ3BdjNlxaCQEhStgrP5/8AiqhImSb3IDFuirEJDiS5Kd7qcBWcDx5VcQspC2wEKcQc5G58qgGDEkTuMTxuKhtLbj5UoLyVd3J9D1xUlCuyoctLTLSBGJCCVA9ORHUGodrUuWoNLKStQ1JHXfx60s+p0SFBsKVpOVaj8RzRjPc7JQw9N4/a1hnvQLmgEqeaGC5y2cTyIrTeDvaUUSWrbxnGRBnHZqY0D2DwPX9315elZfaLY9dVl1pxqOy2CXH3DpQ2nplQ3z4AbmtJ4Gds098WJUaVd4qwS45KbR2QUB8aUYylJ5c/lVW9FIziMQnqa6DkZFFNrdDat8NuLG1hhoaW0qUVaU9EgnfA86KzZYjmiiiiErHtDv7tgsGqFg3GW6mLFGM4Wo/ER4JGT8sdaxu73aPZ7tdnFR1XC4IQ2HZb6italqydIPQAY2GOdWni+Q5evae2lLwMOzNaENpPN5Yysn0TgfWshclvXGTcnnAVB+U6tCVHICcgD6AVc09QbgxbttGRO5c2TdlNuS3VFSSdhnCfIDlQWhIbUh1BzgpG+FAnrmkC2mNqBGnolZO39daapmSrgU+4ENtajmQobrGdyhJ+e5+lXyAOBK3fcgveJVvuZtkhgu4SezU2MnA6H+dWDha8vWS8M3J1GqMApl+Ok/GyoYXv4jGR5gULgMQl9pH1rWvIcdUcqVn8R/2qKvyizbJGEfGMDy8vzruPpO6HrNdtNxTwpxq1Nfc12GWyhqS4B3SyTqaf9ATv4BXlV+ftofecloIVAUT7o5jIJI3P+EjIHiM+IrIrhHWbDbuH3EPrdYU2htwJJBiY1LQo+KVZGDzC0+FXLha/y7DFbt8pJuPDCe6nT3pEZPMJH40DoPiGNs0q1HP9wDn1/aKravAQ9ekq1jdk2uZEss57smYN2aZUFHZLXaBSCf8AKRv5Vo18vFtW0mPFdL7oUNLEca1L8SSNgOu5qEftkG9+0213C1y49wtKmUSpiknWQpBUGkq6ZJJ2O+EGrPeJsO3vR1PFqM1rW4AE7qAGAAkDc+lZ2jq8pmwOzkTR1t3nKmewuD+PWUNDEy1cZWS9SG0oZkvrYLQ5NBxOkFR6kq079KOEpvGEj2lPMz3JaYqVOCWl8HsGWQDhSc7DcDBHPfzqZmsTeJQULjrjQkNHSnVhRJPxKPQgjIA+dOH5d6v1ti8NPR1MuuHFwlhYKJKU8gjByArbVnGNx1q/bkjoZPB+PmUKmUZ9h/uZh7X7+nie7wI0Yq/ZLCz7sjP94lJ7zxH7xwE+QJ61X4Mc5ClEaTklXgKd3WUmfxVdJUZSVxm3jEYUE4+zb2zjzOTXDKTqW4HEhISVIQOSj02p1ShF4kySe55pU6tK1f3Y218sVGyuGYUh0y2lIccZwtTZSQ2s55bb/MVYnWnjgupQEKHezsAeu1NnHAyp90p7NplOpwjoOf1qTAEcwGR1GsGQie4WWo3YLaGFx1bFHgRjYpPiKkktpUoofcIxhJCBnIx/W9MeHtb7LlxlhxMuaoaCkkKQ0NkIxy3zk1OO6NT3Z61HR8fLf5f1gVEHidIjeCyQ8pCACdOAT90eXjU5abWLmqRKlu+7wYvdeeKcHUTslA6qPQfM7Urw9ZFmQ2VRH1rUc9ppUpDYG6lEfe22rQI3DkW96kRkm32SIsqUcaQpW2pZ8VnG5OwG1KstCySrmV+DYXeLGWIUBlMO2MLKlDcpbB3Kln77hGN/0Fa1wrZrdZrahm1s6W8AF5W6ncfeJ8K6t9uj+5MsRkBq2IAKGhsXfNXiDzx16+FTAGBgcqz7bS3HpHquOYUUUUmThTa5SkwrfJlL+FltS/oM05ptcognQJEVSihLyCgqAzgHnRCYu3GdtVlEyclz3+THcnOuHmC4FKwojpy/Os0tsNpNqbWApZIQ6SN9lHJyPA7Yr6Y4+gNyeEbmhDWXRHKWikbg/dx9axy+8JSLHGyYznYDQ0tQVsggbFWOY8D1q/pbAeIi1TKe4hC23ms69SCUkjYc9hmo2yMOfsaOe8hRSlJSBueg+W1WiLaCUhbiVjRyKO8lfX/emdmZSzYmngjL6XnGlNq+LAWoDfG1XM8xWOJHzEOlso095AwVoOrPr41GqZbuV4sdsAy7LuDTSlA806gT+QqSU4Uur0qy4sHmd/In86d8HR23vabwwFdlojPGQceQP0otOEOJxcA5M2+xxY7c+dDWwhSu3BQpScnCdj/CobjKze4pTLtSEqdmSgyiKdgpw5CSk/r5DNWSc2uJJizY41KbQVOjxBOM/nim96dS5e+BNIyh2a88flHcP8apteyHzFP8EEpRh5bDqJWGwNWS3OWuFPj/ALQ1drLW2El115eMrI6DcAbbAUpG4fZMqY4O0kuIUlkuvK1EnqB9eVUfhH2f8RQfaG1d7gpPuqXXJC5YdClPg5wMc8nIznlj0rTre68m1Rm4yQqXKdU8SeSASTk/LFQLlftbOYwop5IkZdXlJckw4iNT5To7o2QNPL86iuN5TfBXCMuYMGetgx2VDmXVkJGPTc/Krpbra3ChSD8b7rhK3DzPeFYl7f7ou5ccWy1RtS2IMcyHQk7FaicfQD864reYwrXr1+YCvb9b9/8AUojTSGIjcdhCitOyHVbE+Oc+eacMtNBkJ0lGlOUajyPTI61J3eB7lFtyXUpMmQ0JLieqEfcHl41Hwmu2lOBx9CcYOSdOR4fKtIEEcRZ+Z2qLPkEBDiHFtnwGAMdc/wAajb+hEqZEsyTlPdelEYJOPhHzP5CrCy43arPNuTi0vJ3SFBW422TvvuaT9nlven3UGUy24+7h1Q25nffwAHSllucnoSQElG4HYNlA0rYOCFJAAO3IUra7Y5dJzUeO0px9a9AQkfEOec9Btv6Ver1YhbI0YISXJsgdmxFQnGAepHU/10q38FcIRbCymQ82hdxWCVL6N6uaU/xPWkPqAF3SYrOcTnh3hdMG1iE8sOoUdUlwE989EJ8EjlVj9yZU2lpTaPd0Y0shPd26kU6AAAAGAK9rPZyxyY8DEKKKKjOwoooohCiiiiE8IBGCMjzppcISZKdQShStJSpKxlLieqVeX6GnlFAOITPnuBWFPkQX1Nx1g9xY1BKs/CetZ8iwSYUm+W64BSkomK0uoGytSQsYONtlcq+gdIOcgb86imrHGRdLpMWVOi4BoOMuYKElCSnI9QR9KspqWB55i2rB6mDSuG2lND3dJLqQftXFYB9QKgeErfJa9oT6nh9rGgKcURnHxAfxFb1dOCW3HQu3vdmg/E2vf6H+dO7XwnDi3GU+4ylXaRxHCiN8Ekqx4b4+lWDqlxFGksCIra8PtB5Q1IVFbGPH4s1BPxyzxXw1FWkqTHblvIVnllpI/wD1VstlvcgMvMlztGsYbONwN9j9abSrf2/EUCQAR2MR5BVp/EUDn8qpM+CQOo1VJAJ7juTlqESNi3HUf+2kLVHRGj29ABKuxypR5k6R/OndzYUqFICNyWFNgCk3liK23tlSWtKR4nYUvnGBJ8ZyYxuc7s4/YtZ7Va9yPu97P1rCLbEe4m9pE5akqcjGSoFWMhLTYAOPnW8KtMlcVvBSHwCTk/eI/n+lVb2fcKSLbZbwp5CWZ0pa2Rg6tCc94j1UVH6Vbrda0O3uKwzNlupmfEjbcy5S57i1JJILSNOCEDugfpUVGtj9wlRI0Vhx6Q+rGWhkgf79TW4ucCRZMb3Z0rbQAAXAe8og8/M7engKstjsVusccNW2KhoYAUvmpXqeZqZ1QVcLDyyTkz5/4+4VfN5svClpjPTHENCXNW0jICs91OfDbPpWt+zzgtrh2AZM9pCrm4kdoQdQRjoDVmtFrEFcp51YelyXVOuO6cbHYJHgAAB8qkqrtezLskwgBzIS22VIujl3ngOXFwaU75SyjolP8T5mpuiilEk9yYGIUUUVyEKKKKIQoooohCiiiiEKKKKIQoooohCiiiiEKKKKIQrzAJyQM0UUQntAGOVFFEIUUUUQhRRRRCFFFFEIUUUUQhRRRRCFFFFEJ//Z`;

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HanziInfo | null>(null);
  const [error, setError] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || !result) return;
    setIsGeneratingImage(true);
    try {
      // Small delay to ensure any UI states (like hover) are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(cardRef.current, { 
        quality: 0.95,
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', margin: '0' },
        filter: (node) => {
          // Ignore elements with data-html2canvas-ignore (used for the download button itself)
          if (node instanceof HTMLElement && node.dataset.html2canvasIgnore !== undefined) {
            return false;
          }
          return true;
        }
      });
      const link = document.createElement('a');
      link.download = `hanzi-navi-${result.japaneseKanji}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      setError("画像の生成に失敗しました。");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const playAudio = async (text: string) => {
    if (playingAudio === text) return;
    setPlayingAudio(text);
    try {
      const { data, mimeType } = await getPronunciationAudio(text);
      
      try {
        // Try standard HTML5 Audio first
        const audio = new Audio(`data:${mimeType};base64,${data}`);
        audio.onended = () => setPlayingAudio(null);
        audio.onerror = () => { throw new Error("Audio element failed"); };
        await audio.play();
      } catch (e) {
        // Fallback: assume raw PCM 16-bit little-endian at 24000Hz
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = window.atob(data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const buffer = audioCtx.createBuffer(1, bytes.length / 2, 24000);
        const channelData = buffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setPlayingAudio(null);
        source.start();
      }
    } catch (err) {
      console.error("Failed to play audio:", err);
      setPlayingAudio(null);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;
    
    // Validate input: Only Kanji/Iteration mark allowed (no hiragana, katakana, romaji)
    const kanjiRegex = /^[\u4E00-\u9FFF\u3400-\u4DBF々]+$/;
    if (!kanjiRegex.test(query)) {
      setError('漢字のみを入力してください（ひらがな、カタカナ、英数字は不可）。');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const info = await getHanziInfo(query);
      setResult(info);
    } catch (err: any) {
      console.error(err);
      setError(`情報の取得に失敗しました。(${err.message || 'エラー'}) もう一度お試しください。`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 p-4 md:p-8 font-jp selection:bg-red-200 selection:text-red-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 mt-8 md:mt-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-red-100 to-amber-100 shadow-md">
              <img 
                src={umamotoImg} 
                alt="馬本先生" 
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4"
          >
            日中漢字ナビ
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium"
          >
            日本語の漢字から、中国語の読み方と意味を学ぼう
          </motion.p>
        </header>

        {/* Search Form */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch} 
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div className="relative flex items-center group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="漢字や単語を入力 (例: 学, 手紙)"
              className="w-full text-3xl p-6 pl-8 pr-20 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100/50 transition-all placeholder:text-slate-300 font-bold text-center md:text-left"
              maxLength={4}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={32} /> : <Search size={32} />}
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-2xl font-medium border border-red-100 max-w-2xl mx-auto"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              ref={cardRef}
              key={result.japaneseKanji}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
            >
              {/* Character Comparison Header */}
              <div className="grid md:grid-cols-2 border-b border-slate-100">
                <div className="p-10 md:p-16 text-center bg-slate-50/50 flex flex-col justify-center items-center relative overflow-hidden group">
                  <div className="absolute top-6 left-6 text-sm font-bold text-slate-400 tracking-widest uppercase">日本語</div>
                  <button 
                    onClick={() => handleCopy(result.japaneseKanji)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="コピー"
                    data-html2canvas-ignore
                  >
                    {copiedText === result.japaneseKanji ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                  <div className={`font-jp font-black text-slate-800 leading-none drop-shadow-sm ${result.japaneseKanji.length > 2 ? 'text-6xl md:text-7xl' : result.japaneseKanji.length > 1 ? 'text-7xl md:text-8xl' : 'text-[8rem] md:text-[10rem]'}`}>
                    {result.japaneseKanji}
                  </div>
                </div>
                <div className="p-10 md:p-16 text-center bg-red-50/40 flex flex-col justify-center items-center relative overflow-hidden group">
                  <div className="absolute top-6 left-6 text-sm font-bold text-red-400 tracking-widest uppercase">中国語 (簡体字)</div>
                  <button 
                    onClick={() => handleCopy(result.chineseHanzi)}
                    className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-100/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="コピー"
                    data-html2canvas-ignore
                  >
                    {copiedText === result.chineseHanzi ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                  <div className={`font-sc font-black text-red-600 leading-none drop-shadow-sm ${result.chineseHanzi.length > 2 ? 'text-6xl md:text-7xl' : result.chineseHanzi.length > 1 ? 'text-7xl md:text-8xl' : 'text-[8rem] md:text-[10rem]'}`}>
                    {result.chineseHanzi}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative group/pinyin">
                      <div className="text-3xl md:text-4xl font-medium text-red-500 tracking-wide bg-white/60 px-6 py-2 rounded-full shadow-sm">
                        {result.pinyin}
                      </div>
                      <button 
                        onClick={() => handleCopy(result.pinyin)}
                        className="absolute -right-2 -top-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-colors opacity-0 group-hover/pinyin:opacity-100"
                        title="ピンインをコピー"
                        data-html2canvas-ignore
                      >
                        {copiedText === result.pinyin ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <button 
                      onClick={() => playAudio(result.chineseHanzi)}
                      disabled={playingAudio === result.chineseHanzi}
                      className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                      title="音声を再生"
                      data-html2canvas-ignore
                    >
                      {playingAudio === result.chineseHanzi ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 md:p-12 space-y-12">
                {/* Meaning & Nuance */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      意味
                    </h3>
                    <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-medium">
                      {result.meaningInJapanese}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-3xl p-6 md:p-8 border border-amber-100/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    <h3 className="text-sm font-bold text-amber-600 tracking-widest mb-3 uppercase">解説・ニュアンス</h3>
                    <p className="text-lg md:text-xl text-amber-900 leading-relaxed font-medium">
                      {result.nuanceOrDifference}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 tracking-widest mb-6 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    単語の例
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {result.examples.map((example, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        key={idx} 
                        className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex flex-col gap-1 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-4xl font-sc font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                              {example.chineseWord}
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleCopy(example.chineseWord)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="単語をコピー"
                                data-html2canvas-ignore
                              >
                                {copiedText === example.chineseWord ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                              </button>
                              <button 
                                onClick={() => playAudio(example.chineseWord)}
                                disabled={playingAudio === example.chineseWord}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                title="音声を再生"
                                data-html2canvas-ignore
                              >
                                {playingAudio === example.chineseWord ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
                              </button>
                            </div>
                          </div>
                          <span className="text-xl text-red-500 font-medium tracking-wide">
                            {example.pinyin}
                          </span>
                        </div>
                        <p className="text-lg text-slate-600 font-medium border-t border-slate-100 pt-4">
                          {example.japaneseTranslation}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share/Download Button */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-center" data-html2canvas-ignore>
                <button
                  onClick={handleShare}
                  disabled={isGeneratingImage}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                  画像として保存・シェア
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
