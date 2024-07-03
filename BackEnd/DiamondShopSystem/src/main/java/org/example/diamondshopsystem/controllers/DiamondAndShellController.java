package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.ShellDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.imp.DiamondServiceImp;
import org.example.diamondshopsystem.services.imp.ProductServiceImp;
import org.example.diamondshopsystem.services.imp.ShellServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/manage")
@CrossOrigin(origins = "*")
public class DiamondAndShellController {

    @Autowired
    private DiamondServiceImp diamondServiceImp;

    @Autowired
    private ShellServiceImp shellServiceImp;

    @Autowired
    private ProductServiceImp productServiceImp;


    @GetMapping("/diamond/get-all")
    public ResponseEntity<List<DiamondDTO>> getAllDiamond() {
        List<DiamondDTO> diamondDTOs = diamondServiceImp.getAllDiamonds();
        return new ResponseEntity<>(diamondDTOs, HttpStatus.OK);
    }

    @GetMapping("/diamond/search-by-4c")
    public ResponseEntity<List<DiamondDTO>> searchDiamondBy4c(@RequestBody DiamondDTO diamondDTO) {
        List<DiamondDTO> diamondDTOS = diamondServiceImp.getDiamondsBy4C(diamondDTO);
        return new ResponseEntity<>(diamondDTOS, HttpStatus.OK);
    }

    @PostMapping("/diamond/create")
    public ResponseEntity<?> createDiamond(@RequestBody DiamondDTO diamondDTO) {
        try {
            diamondServiceImp.createDiamond(diamondDTO);
//            productServiceImp.updateProductQuantity(diamondDTO1.getProductId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Can not found product with this product id", HttpStatus.NOT_FOUND);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Can not found diamond price with this 4C", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/diamond/update")
    public ResponseEntity<ResponseData> updateDiamond(@RequestBody DiamondDTO diamondDTO) {
        ResponseData respData = new ResponseData();
        try {
            DiamondDTO diamondDTO1 = diamondServiceImp.updateDiamond(diamondDTO);
            productServiceImp.updateProductQuantity(diamondDTO1.getProductId());
            respData.setStatus(200);
            respData.setSuccess(true);
            respData.setDescription("Diamond updated successfully");
            respData.setData(diamondDTO1);
            return new ResponseEntity<>(respData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            respData.setStatus(404);
            respData.setSuccess(false);
            respData.setDescription("Diamond not found");
            respData.setData(null);
            return new ResponseEntity<>(respData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            respData.setStatus(500);
            respData.setSuccess(false);
            respData.setDescription("Diamond update failed");
            respData.setData(null);
            return new ResponseEntity<>(respData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/diamond/delete/{id}")
    public ResponseEntity<ResponseData> deleteDiamond(@PathVariable int id) {
        ResponseData respData = new ResponseData();
        try {
            diamondServiceImp.deleteDiamond(id);
//            productServiceImp.updateProductQuantity(diamondDTO.getProductId());
            respData.setStatus(204);
            respData.setSuccess(true);
            respData.setDescription("Diamond deleted successfully");
            return new ResponseEntity<>(respData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            respData.setStatus(404);
            respData.setSuccess(false);
            respData.setDescription("Diamond not found");
            respData.setData(null);
            return new ResponseEntity<>(respData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            respData.setStatus(500);
            respData.setSuccess(false);
            respData.setDescription("Diamond delete failed");
            respData.setData(null);
            return new ResponseEntity<>(respData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/diamond/pro/{idProduct}")
    public ResponseEntity<DiamondDTO> getDiamondByIdProduct(@PathVariable int idProduct) {
        DiamondDTO diamondDTO = diamondServiceImp.getDiamondByProductId(idProduct);
        if (diamondDTO != null) {
            return ResponseEntity.ok(diamondDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //========================================================================================================== Shell
    @GetMapping("/shell/{id}")
    public ResponseEntity<ShellDTO> getShellById(@PathVariable int id) {
        ShellDTO shellDTO = shellServiceImp.getShellById(id);
        if (shellDTO != null) {
            return ResponseEntity.ok(shellDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/shell/get-all")
    public ResponseEntity<List<ShellDTO>> getAllShell() {
        List<ShellDTO> shellDTOS = shellServiceImp.getAllShells();
        return new ResponseEntity<>(shellDTOS, HttpStatus.OK);
    }

    @GetMapping("/shell/search-by-name/{name}")
    public ResponseEntity<List<ShellDTO>> searchShellByName(@PathVariable String name) {
        List<ShellDTO> shellDTOS = shellServiceImp.getShellsByName(name);
        return new ResponseEntity<>(shellDTOS, HttpStatus.OK);
    }

    @PostMapping("/shell/create")
    public ResponseEntity<ShellDTO> createShell(@RequestBody ShellDTO shellDTO) {
        ShellDTO shellDTO1 = shellServiceImp.createShell(shellDTO);
        return new ResponseEntity<>(shellDTO1, HttpStatus.CREATED);
    }

    @PutMapping("/shell/update")
    public ResponseEntity<ResponseData> updateShell(@RequestBody ShellDTO shellDTO) {
        ResponseData responseData = new ResponseData();

        try {
            ShellDTO shellDTO1 = shellServiceImp.updateShell(shellDTO);

            responseData.setStatus(200);
            responseData.setSuccess(true);
            responseData.setDescription("Shell updated successfully");
            responseData.setData(shellDTO1);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Shell not found");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            responseData.setStatus(500);
            responseData.setSuccess(false);
            responseData.setDescription("Shell update failed");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/shell/delete/{id}")
    public ResponseEntity<ResponseData> deleteShell(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            ShellDTO shellDTO1 = shellServiceImp.deleteShell(id);
            responseData.setStatus(200);
            responseData.setSuccess(true);
            responseData.setDescription("Shell delete successfully");
            responseData.setData(shellDTO1);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Shell not found");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            responseData.setStatus(500);
            responseData.setSuccess(false);
            responseData.setDescription("Shell delete failed");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
