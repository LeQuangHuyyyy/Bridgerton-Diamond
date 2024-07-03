package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.ShellDTO;
import org.example.diamondshopsystem.entities.Shell;
import org.example.diamondshopsystem.repositories.ShellRepository;
import org.example.diamondshopsystem.services.imp.ProductServiceImp;
import org.example.diamondshopsystem.services.imp.ShellServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ShellService implements ShellServiceImp {
    @Autowired
    ShellRepository shellRepository;

    @Autowired
    ProductServiceImp productServiceImp;

    @Override
    public ShellDTO createShell(ShellDTO shellDTO) {
        Shell shell = new Shell();

        shell.setShellName(shellDTO.getShellName());
        shell.setShellMaterial(shellDTO.getShellMaterial());
        shell.setShellPrice(shellDTO.getShellPrice());
        shell.setShellDesign(shellDTO.getShellDesign());
        shell.setShellWeight(shellDTO.getShellWeight());
        Shell savedShell = shellRepository.save(shell);
        return mapShellToDTO(savedShell);
    }

    @Override
    public ShellDTO updateShell(ShellDTO shellDTO) {
        Shell shellToUpdate = shellRepository.findById(shellDTO.getShellId()).orElseThrow(() -> new NoSuchElementException("Shell not found"));

        shellToUpdate.setShellName(shellDTO.getShellName());
        shellToUpdate.setShellMaterial(shellDTO.getShellMaterial());
        shellToUpdate.setShellPrice(shellDTO.getShellPrice());
        shellToUpdate.setShellDesign(shellDTO.getShellDesign());
        shellToUpdate.setShellWeight(shellDTO.getShellWeight());
        Shell savedShell = shellRepository.save(shellToUpdate);

        //update product price
        productServiceImp.updateProductPrice(savedShell);

        return mapShellToDTO(savedShell);
    }

    @Override
    public ShellDTO deleteShell(int id) {
        Shell shellToDelete = shellRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Shell not found"));

        shellToDelete.setShellPrice(0);
        productServiceImp.updateProductPrice(shellToDelete);
        shellRepository.delete(shellToDelete);
        return mapShellToDTO(shellToDelete);
    }

    @Override
    public List<ShellDTO> getAllShells() {
        List<Shell> shells = shellRepository.findAll();
        List<ShellDTO> shellDTOs = new ArrayList<>();
        for (Shell shell : shells) {
            shellDTOs.add(mapShellToDTO(shell));
        }
        return shellDTOs;
    }

    @Override
    public ShellDTO getShellById(int id) {
        Shell shell = shellRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Shell not found"));
        return mapShellToDTO(shell);
    }

    @Override
    public List<ShellDTO> getShellsByName(String name) {
        List<Shell> shells = shellRepository.findAllByShellName(name);
        List<ShellDTO> shellDTOs = new ArrayList<>();
        for (Shell shell : shells) {
            shellDTOs.add(mapShellToDTO(shell));
        }
        return shellDTOs;
    }


    ShellDTO mapShellToDTO(Shell shell) {
        ShellDTO shellDTO = new ShellDTO();
        shellDTO.setShellId(shell.getShellId());
        shellDTO.setShellName(shell.getShellName());
        shellDTO.setShellMaterial(shell.getShellMaterial());
        shellDTO.setShellWeight(shell.getShellWeight());
        shellDTO.setShellDesign(shell.getShellDesign());
        shellDTO.setShellPrice(shell.getShellPrice());
        return shellDTO;
    }
}
