package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.ShellDTO;
import org.example.diamondshopsystem.entities.Shell;

import java.util.List;

public interface ShellServiceImp {
    ShellDTO createShell(ShellDTO shell);
    ShellDTO updateShell(ShellDTO shell);
    ShellDTO deleteShell(int id);
    List<ShellDTO> getAllShells();
    ShellDTO getShellById(int id);
    List<ShellDTO> getShellsByName(String name);
}
