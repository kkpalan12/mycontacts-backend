const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
})

//@desc create new contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async(req,res)=>{
    console.log(req.body)

    const {name,email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandotory")
    }
    const contact = await Contact.create(
        {
            name,
            email,
            phone,
            user_id: req.user.id
        }
    )
    res.status(201).json(contact)
})


//@desc get contact
//@route Get /api/contacts/:id
//@access private

const getContact =asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json({
        message: contact

    })
})

//@desc update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User dont have access to update")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id, req.body, {
            new:true
        }
    )
    res.status(200).json(updatedContact)
})

//@desc delete contact
//@route DELETE /api/contacts
//@access private

const deleteContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User dont have access to delete")
    }
    await Contact.deleteOne({_id: req.params.id})
    res.status(200).json(contact)
}
)


module.exports = {getContact, createContact, getContacts, updateContact, deleteContact}