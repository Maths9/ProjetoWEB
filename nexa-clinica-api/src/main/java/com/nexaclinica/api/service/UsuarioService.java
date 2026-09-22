package com.nexaclinica.api.service;

import com.nexaclinica.api.entity.Usuario;
import com.nexaclinica.api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuario) {
        Usuario existente = buscarPorId(id);
        return usuarioRepository.save(usuario);
    }

    public Usuario ativarDesativar(Long id) {
        Usuario existente = buscarPorId(id);
        // existente.setAtivo(!existente.isAtivo());
        // return usuarioRepository.save(existente);
        return existente;
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
